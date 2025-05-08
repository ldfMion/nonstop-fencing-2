// import "server-only";
// import { competitions, countries, events } from "./schema";
import { competitions, countries, events } from "./schema";
import { db } from ".";
import { Competition } from "~/app/events/events-list";
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
} from "drizzle-orm";

export type DBEventInput = typeof events.$inferInsert;

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
			flag: r.flag,
			weapons: r.weapons,
			types: r.types,
			genders: r.genders,
			date: { start: r.startDate!, end: r.endDate! },
		}));
	},
};

function arrayAgg<Col extends AnyColumn>(column: Col) {
	return sql<
		GetColumnData<Col, "raw">[]
	>`array_agg(distinct ${sql`${column}`}) filter (where ${column} is not null)`;
}
