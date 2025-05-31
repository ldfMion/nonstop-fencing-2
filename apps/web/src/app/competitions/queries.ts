import {
	competitionsWithFlagsAndEvents,
	competitions,
	competitionsWithFlag,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { sql, eq, and, gt, lt, max, min, desc, asc } from "drizzle-orm";
import { Competition } from "~/lib/models";
import { arrayAgg } from "~/infra/db/utils";
import { eventsWithWinners } from "~/infra/db/queries";
import { mapEventWithWinner } from "~/infra/db/mappers";

export async function getCompetition(id: number) {
	const fromDb = (
		await db
			.select()
			.from(competitionsWithFlag)
			.where(eq(competitionsWithFlag.competitionId, id))
			.limit(1)
	)[0];
	const events = await db
		.select()
		.from(eventsWithWinners)
		.where(eq(eventsWithWinners.competition, id));
	return {
		id: fromDb.competitionId,
		name: fromDb.name,
		season: fromDb.season,
		events: events.map(mapEventWithWinner),
		date: {
			start: events[0]!.date,
			end: events.at(-1)!.date,
		},
		flag: fromDb.flag ?? undefined,
	};
}

export async function getCompetitions(season: number) {
	return db
		.select({ id: competitions.id })
		.from(competitions)
		.where(eq(competitions.season, season));
}

export async function getFilteredCompetitions(
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
			id: competitionsWithFlagsAndEvents.competitionId,
			name: competitionsWithFlagsAndEvents.name,
			flag: competitionsWithFlagsAndEvents.flag,
			weapons: arrayAgg(competitionsWithFlagsAndEvents.weapon),
			types: arrayAgg(competitionsWithFlagsAndEvents.type),
			genders: arrayAgg(competitionsWithFlagsAndEvents.gender),
			startDate: min(competitionsWithFlagsAndEvents.date),
			endDate: max(competitionsWithFlagsAndEvents.date),
		})
		.from(competitionsWithFlagsAndEvents)
		.where(
			and(
				eq(competitionsWithFlagsAndEvents.season, filters.season),
				filters.gender
					? eq(competitionsWithFlagsAndEvents.gender, filters.gender)
					: undefined,
				filters.weapon
					? eq(competitionsWithFlagsAndEvents.weapon, filters.weapon)
					: undefined,
				filters.type
					? eq(competitionsWithFlagsAndEvents.type, filters.type)
					: undefined
			)
		)
		.groupBy(
			competitionsWithFlagsAndEvents.competitionId,
			competitionsWithFlagsAndEvents.flag,
			competitionsWithFlagsAndEvents.name
		)
		.having(
			filters.upcoming
				? gt(max(competitionsWithFlagsAndEvents.date), now)
				: lt(max(competitionsWithFlagsAndEvents.date), now)
		)
		.orderBy(
			filters.upcoming
				? asc(min(competitionsWithFlagsAndEvents.date))
				: desc(min(competitionsWithFlagsAndEvents.date))
		);
	return rows.map(r => ({
		id: r.id,
		name: r.name,
		flag: r.flag ?? undefined,
		weapons: r.weapons,
		types: r.types,
		genders: r.genders,
		date: { start: r.startDate!, end: r.endDate! },
	}));
}
