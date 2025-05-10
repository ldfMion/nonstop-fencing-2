// import "server-only";
// import { competitions, countries, events } from "./schema";
import { competitions, countries, events, fencers, liveBouts } from "./schema";
import { db } from ".";
import { Competition } from "~/app/events/(browse)/events-list";
import {
	sql,
	eq,
	and,
	gt,
	lt,
	AnyColumn,
	GetColumnData,
	max,
	min,
	inArray,
	desc,
	aliasedTable,
} from "drizzle-orm";
import assert from "assert";
import { EventModel, NewBoutModel } from "~/models";

export const QUERIES = {
	async getCompetitions(
		filters: {
			season: number;
			gender?: "MEN" | "WOMEN";
			weapon?: "FOIL" | "EPEE" | "SABER";
			type?: "INDIVIDUAL" | "TEAM";
			upcoming: boolean;
		} = { season: 2025, upcoming: false }
	): Promise<Competition[]> {
		const now = sql`now()`;

		const rows = await db
			.select({
				id: competitions.id,
				name: competitions.name,
				flag: countries.isoCode,
				weapons: arrayAgg(events.weapon), // DISTINCT array_agg
				types: arrayAgg(events.type),
				genders: arrayAgg(events.gender),
				startDate: min(events.date),
				endDate: max(events.date),
			})
			.from(competitions)
			.innerJoin(countries, eq(competitions.host, countries.iocCode))
			.innerJoin(events, eq(events.competition, competitions.id))
			.where(
				and(
					eq(competitions.season, filters.season),
					filters.gender
						? eq(events.gender, filters.gender)
						: undefined,
					filters.weapon
						? eq(events.weapon, filters.weapon)
						: undefined,
					filters.type ? eq(events.type, filters.type) : undefined
				)
			)
			.groupBy(competitions.id, countries.isoCode)
			.having(
				filters.upcoming
					? gt(max(events.date), now)
					: lt(max(events.date), now)
			)
			.orderBy(min(events.date));

		return rows.map(r => ({
			id: r.id,
			name: r.name,
			flag: r.flag ?? undefined,
			weapons: r.weapons,
			types: r.types,
			genders: r.genders,
			date: { start: r.startDate!, end: r.endDate! },
		}));
	},
	async getEvent(id: number): Promise<EventModel> {
		const row = await db
			.select()
			.from(events)
			.where(eq(events.id, id))
			.leftJoin(competitions, eq(events.competition, competitions.id))
			.innerJoin(countries, eq(competitions.host, countries.iocCode))
			.limit(1);
		assert(row.length == 1, `found ${row.length} events with id ${id}`);
		return {
			...row[0]!.events_0,
			season: row[0]!.competitions_0!.season,
			name: row[0]!.competitions_0!.name,
			flag: row[0]!.countries_0!.isoCode ?? undefined,
		};
	},
	async insertFencers(
		newFencers: {
			firstName: string;
			lastName: string;
			country: string;
			gender: "MEN" | "WOMEN";
		}[]
	) {
		console.log(
			db
				.insert(fencers)
				.values(newFencers)
				.onConflictDoNothing({
					target: [
						fencers.firstName,
						fencers.lastName,
						fencers.country,
					],
				})
		);
	},
	async insertCountries(
		newCountries: { iocCode: string; isoCode?: string }[]
	) {
		console.log(
			await db
				.insert(countries)
				.values(newCountries)
				.onConflictDoNothing()
		);
	},
	async getFencers(filters: { firstName: string[]; lastName?: string[] }) {
		return await db
			.select()
			.from(fencers)
			.where(
				and(
					filters.firstName
						? inArray(fencers.firstName, filters.firstName)
						: undefined,
					filters.lastName
						? inArray(fencers.lastName, filters.lastName)
						: undefined
				)
			);
	},
	async insertLiveBouts(bouts: NewBoutModel[]) {
		console.log(
			await db.transaction(tx =>
				tx
					.insert(liveBouts)
					.values(bouts)
					.onConflictDoUpdate({
						set: {
							fencerAScore: liveBouts.fencerAScore,
							fencerBScore: liveBouts.fencerBScore,
							winnerIsA: liveBouts.winnerIsA,
						},
						target: [
							liveBouts.event,
							liveBouts.order,
							liveBouts.round,
						],
					})
			)
		);
	},
	async getLiveTableau(eventId: number) {
		const fencers2 = aliasedTable(fencers, "fencers2");
		return db
			.select({
				fencerA: {
					firstName: fencers.firstName,
					lastName: fencers.lastName,
					score: liveBouts.fencerAScore,
				},
				fencerB: {
					firstName: fencers2.firstName,
					lastName: fencers2.lastName,
					score: liveBouts.fencerBScore,
				},
				round: liveBouts.round,
				order: liveBouts.order,
				winnerIsA: liveBouts.winnerIsA,
			})
			.from(liveBouts)
			.where(eq(liveBouts.event, eventId))
			.orderBy(desc(liveBouts.round), liveBouts.order)
			.leftJoin(fencers, eq(liveBouts.fencerA, fencers.id))
			.leftJoin(fencers2, eq(liveBouts.fencerB, fencers2.id));
	},
};

function arrayAgg<Col extends AnyColumn>(column: Col) {
	return sql<
		GetColumnData<Col, "raw">[]
	>`array_agg(distinct ${sql`${column}`}) filter (where ${column} is not null)`;
}
