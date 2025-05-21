import {
	competitionsWithFlagsAndEvents,
	competitions,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { sql, eq, and, gt, lt, max, min, desc, asc } from "drizzle-orm";
import { Competition } from "~/lib/models";
import { arrayAgg } from "~/infra/db/utils";

export async function getCompetition(id: number) {
	/*
		const row = await db
			.select({
				id: competitions.id,
				name: competitions.name,
				flag: countries.isoCode,
				date: {
					startDate: min(events.date),
					endDate: max(events.date),
				},
				events: arrayAgg(events.id),
			})
			.from(competitions)
			.where(eq(competitions.id, id))
			.leftJoin(countries, eq(competitions.host, countries.iocCode))
			.leftJoin(events, eq(events.competition, competitions.id))
			.groupBy(competitions.id, countries.iocCode);
		return row;
        */
	const fromDb = await db.query.competitions.findFirst({
		where: (competitions, { eq }) => eq(competitions.id, id),
		with: {
			events: true,
			host: true,
		},
	});
	if (fromDb == undefined) {
		return undefined;
	}
	const sortedEvents = fromDb.events.sort(
		(a, b) => a.date.getTime() - b.date.getTime()
	);
	return {
		id: fromDb.id,
		name: fromDb.name,
		season: fromDb.season,
		events: fromDb.events,
		date: {
			start: sortedEvents[0]!.date,
			end: sortedEvents.at(-1)!.date,
		},
		flag: fromDb.host.isoCode ?? undefined,
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
