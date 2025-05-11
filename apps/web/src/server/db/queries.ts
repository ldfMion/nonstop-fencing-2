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
	max,
	min,
	inArray,
	desc,
	aliasedTable,
	isNull,
	SQL,
} from "drizzle-orm";
import assert from "assert";
import { BoutModel, EventModel, NewBoutModel } from "~/models";
import { getIsoCodeFromIocCode } from "../countries";
import { arrayAgg } from "./utils";

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
			await db.transaction(tx =>
				tx
					.insert(fencers)
					.values(newFencers)
					.onConflictDoNothing({
						target: [
							fencers.firstName,
							fencers.lastName,
							fencers.country,
						],
					})
			)
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
		const missingIsoCode = await db
			.select({ iocCode: countries.iocCode })
			.from(countries)
			.where(isNull(countries.isoCode));
		if (missingIsoCode.length == 0) {
			return;
		}
		const updated = await Promise.all(
			missingIsoCode.map(async row => ({
				isoCode: await getIsoCodeFromIocCode(row.iocCode),
				iocCode: row.iocCode,
			}))
		);
		console.log("update countries");

		const sqlChunks: SQL[] = [];
		sqlChunks.push(sql`(case`);
		sqlChunks.push(
			...updated.map(
				row =>
					sql`when ${countries.iocCode} = ${row.iocCode} then ${row.isoCode}`
			)
		);
		const iocCodes: string[] = updated.map(row => row.iocCode);
		sqlChunks.push(sql`end)`);
		const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));
		console.log(
			await db
				.update(countries)
				.set({ isoCode: finalSql })
				.where(inArray(countries.iocCode, iocCodes))
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
		// TODO I don't think this will update a bout with a new score/fencer
		if (bouts.length == 0) {
			return;
		}
		console.log(
			await db.transaction(tx =>
				tx
					.insert(liveBouts)
					.values(bouts)
					.onConflictDoUpdate({
						set: {
							fencerA: sql`EXCLUDED.fencer_a`,
							fencerB: sql`EXCLUDED.fencer_b`,
							fencerAScore: sql`EXCLUDED.fencer_a_score`,
							fencerBScore: sql`EXCLUDED.fencer_b_score`,
							winnerIsA: sql`EXCLUDED.winner_is_a`,
						},
						target: [
							liveBouts.event,
							liveBouts.order,
							liveBouts.round,
						],
					})
			)
		);
		console.log("updating last live update in event");
		console.log(
			await db
				.update(events)
				.set({ lastLiveUpdate: sql`now()` })
				.where(eq(events.id, bouts[0]!.event))
		);
	},
	async getLiveTableau(eventId: number): Promise<BoutModel[]> {
		const fencers2 = aliasedTable(fencers, "fencers2");
		const countries2 = aliasedTable(countries, "countries2");
		return (
			await db
				.select({
					id: liveBouts.id,
					fencerA: {
						firstName: fencers.firstName,
						lastName: fencers.lastName,
						score: liveBouts.fencerAScore,
						flag: countries.isoCode,
					},
					fencerB: {
						firstName: fencers2.firstName,
						lastName: fencers2.lastName,
						score: liveBouts.fencerBScore,
						flag: countries2.isoCode,
					},
					round: liveBouts.round,
					order: liveBouts.order,
					winnerIsA: liveBouts.winnerIsA,
				})
				.from(liveBouts)
				.where(eq(liveBouts.event, eventId))
				.orderBy(desc(liveBouts.round), liveBouts.order)
				.leftJoin(fencers, eq(liveBouts.fencerA, fencers.id))
				.leftJoin(fencers2, eq(liveBouts.fencerB, fencers2.id))
				.leftJoin(countries, eq(fencers.country, countries.iocCode))
				.leftJoin(countries2, eq(fencers2.country, countries2.iocCode))
		).map(b => ({
			fencerA: b.fencerA.firstName
				? {
						firstName: b.fencerA.firstName!,
						lastName: b.fencerA.lastName!,
						score: b.fencerA.score ?? undefined,
						flag: b.fencerA.flag ?? undefined,
					}
				: undefined,
			fencerB: b.fencerB.firstName
				? {
						firstName: b.fencerB.firstName!,
						lastName: b.fencerB.lastName!,
						score: b.fencerB.score ?? undefined,
						flag: b.fencerB.flag ?? undefined,
					}
				: undefined,
			round: b.round,
			order: b.order,
			winnerIsA: b.winnerIsA ?? undefined,
			id: b.id,
		}));
	},
};
