import {
	lte,
	sql,
	desc,
	asc,
	min,
	and,
	eq,
	gt,
	aliasedTable,
	or,
} from "drizzle-orm";
import { db } from "~/infra/db";
import { mapEventWithWinner } from "~/infra/db/mappers";
import { eventsWithWinners } from "~/infra/db/queries";
import {
	competitionsWithFlagsAndEvents,
	countries,
	fencers,
	individualSeasonRankings,
	teamSeasonRankings,
} from "~/infra/db/schema";
import { shuffle, toTitleCase, withoutTime } from "~/lib/utils";

function getToday() {
	return sql`CURRENT_DATE`;
}

export async function getCompetitionsWithEvents({
	next,
	numCompetitions,
	numEventsPerCompetition,
	weapon,
}: {
	next: boolean;
	numCompetitions: number;
	numEventsPerCompetition?: number;
	weapon?: "FOIL" | "EPEE" | "SABER";
}) {
	const today = getToday();
	const rows = await db
		.select({
			id: competitionsWithFlagsAndEvents.competitionId,
			name: competitionsWithFlagsAndEvents.name,
			flag: competitionsWithFlagsAndEvents.flag,
			date: min(competitionsWithFlagsAndEvents.date),
		})
		.from(competitionsWithFlagsAndEvents)
		.where(
			weapon
				? eq(competitionsWithFlagsAndEvents.weapon, weapon)
				: undefined
		)
		.groupBy(
			competitionsWithFlagsAndEvents.competitionId,
			competitionsWithFlagsAndEvents.name,
			competitionsWithFlagsAndEvents.flag
		)
		.having(
			next
				? lte(today, min(competitionsWithFlagsAndEvents.date))
				: gt(today, min(competitionsWithFlagsAndEvents.date))
		)
		.orderBy(
			next
				? asc(min(competitionsWithFlagsAndEvents.date))
				: desc(min(competitionsWithFlagsAndEvents.date))
		)
		.limit(numCompetitions);
	const withEvents = await Promise.all(
		rows.map(async competition => {
			const eventRows = await db
				.select()
				.from(eventsWithWinners)
				.where(
					and(
						eq(eventsWithWinners.competition, competition.id),
						weapon
							? eq(eventsWithWinners.weapon, weapon)
							: undefined
					)
				)
				.orderBy(
					next
						? asc(eventsWithWinners.date)
						: desc(eventsWithWinners.date)
				)
				.limit(numEventsPerCompetition ?? 100);
			return {
				id: competition.id,
				name: competition.name,
				flag: competition.flag ?? undefined,
				events: eventRows.map(e => mapEventWithWinner(e)),
			};
		})
	);
	return withEvents;
}

export async function getTodaysEvents() {
	const today = getToday();
	const rows = await db
		.select({
			id: competitionsWithFlagsAndEvents.eventId,
			weapon: competitionsWithFlagsAndEvents.weapon,
			gender: competitionsWithFlagsAndEvents.gender,
			type: competitionsWithFlagsAndEvents.type,
			date: competitionsWithFlagsAndEvents.date,
			competitionName: competitionsWithFlagsAndEvents.name,
			flag: competitionsWithFlagsAndEvents.flag,
		})
		.from(competitionsWithFlagsAndEvents)
		.where(and(eq(competitionsWithFlagsAndEvents.date, today)));
	return rows.map(e => ({
		...e,
		date: withoutTime(e.date),
		flag: e.flag ?? undefined,
		description: toTitleCase(`${e.gender}'s ${e.weapon} ${e.type}`),
	}));
}

export async function getTopRankings(weapon?: "FOIL" | "EPEE" | "SABER") {
	const individual = (
		await db
			.select({
				fencer: {
					firstName: fencers.firstName,
					lastName: fencers.lastName,
					id: fencers.id,
				},
				flag: countries.isoCode,
				position: individualSeasonRankings.position,
				weapon: individualSeasonRankings.weapon,
				gender: individualSeasonRankings.gender,
			})
			.from(individualSeasonRankings)
			.where(
				and(
					eq(individualSeasonRankings.position, 1),
					eq(individualSeasonRankings.season, 2025),
					weapon
						? eq(individualSeasonRankings.weapon, weapon)
						: undefined
				)
			)
			.innerJoin(fencers, eq(individualSeasonRankings.fencer, fencers.id))
			.innerJoin(countries, eq(fencers.country, countries.iocCode))
	).map(r => ({ ...r, flag: r.flag ?? undefined }));
	const teams = (
		await db
			.select({
				team: { name: countries.name, id: countries.iocCode },
				flag: countries.isoCode,
				position: teamSeasonRankings.position,
				weapon: teamSeasonRankings.weapon,
				gender: teamSeasonRankings.gender,
			})
			.from(teamSeasonRankings)
			.where(
				and(
					eq(teamSeasonRankings.position, 1),
					eq(teamSeasonRankings.season, 2025),
					weapon ? eq(teamSeasonRankings.weapon, weapon) : undefined
				)
			)
			.innerJoin(
				countries,
				eq(teamSeasonRankings.team, countries.iocCode)
			)
	).map(r => ({
		...r,
		flag: r.flag ?? undefined,
		team: {
			name: r.team.name!,
			id: r.team.id,
		},
	}));
	shuffle(individual);
	shuffle(teams);
	return { individual, teams };
}
