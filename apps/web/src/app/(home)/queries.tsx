import {
	lte,
	gte,
	sql,
	desc,
	asc,
	min,
	max,
	SQL,
	and,
	eq,
	gt,
	aliasedTable,
	or,
} from "drizzle-orm";
import { db } from "~/infra/db";
import {
	competitionsWithFlagsAndEvents,
	countries,
	events,
	fencers,
	pastBouts,
	pastTeamRelays,
} from "~/infra/db/schema";
import { toTitleCase, withoutTime } from "~/lib/utils";

function getToday() {
	return sql`CURRENT_DATE`;
}

export async function getCompetitionsWithEvents(
	next: boolean,
	limit: number,
	weapon?: "FOIL" | "EPEE" | "SABER"
) {
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
		.limit(limit);
	// const fencers2 = aliasedTable(fencers, "fencers2");
	const countries2 = aliasedTable(countries, "countries2");
	const withEvents = await Promise.all(
		rows.map(async competition => {
			const eventRows = await db
				.select({
					id: events.id,
					weapon: events.weapon,
					gender: events.gender,
					type: events.type,
					date: events.date,
					hasResults: events.hasResults,
					individualWinner: {
						id: fencers.id,
						firstName: fencers.firstName,
						lastName: fencers.lastName,
						flag: countries.isoCode,
					},
					teamWinner: {
						id: countries2.iocCode,
						name: countries2.name,
						flag: countries2.isoCode,
					},
					winnerIsA: pastBouts.winnerIsA,
				})
				.from(events)
				.where(
					and(
						eq(events.competition, competition.id),
						!next
							? or(
									eq(pastBouts.round, "2"),
									and(
										eq(pastTeamRelays.round, "2"),
										eq(pastTeamRelays.bracket, "MAIN")
									)
							  )
							: undefined,
						weapon ? eq(events.weapon, weapon) : undefined
					)
				)
				.orderBy(next ? asc(events.date) : desc(events.date))
				.leftJoin(pastBouts, eq(events.id, pastBouts.event))
				.leftJoin(
					fencers,
					or(
						and(
							eq(pastBouts.winnerIsA, true),
							eq(pastBouts.fencerA, fencers.id)
						),
						and(
							eq(pastBouts.winnerIsA, false),
							eq(pastBouts.fencerB, fencers.id)
						)
					)
				)
				.leftJoin(countries, eq(fencers.country, countries.iocCode))
				.leftJoin(pastTeamRelays, eq(events.id, pastTeamRelays.event))
				.leftJoin(
					countries2,
					eq(
						pastTeamRelays.winnerIsA
							? pastTeamRelays.teamA
							: pastTeamRelays.teamB,
						countries2.iocCode
					)
				)
				.limit(3);
			console.log(eventRows);
			return {
				id: competition.id,
				name: competition.name,
				flag: competition.flag ?? undefined,
				events: eventRows.map(e => ({
					id: e.id,
					weapon: e.weapon,
					gender: e.gender,
					type: e.type,
					hasResults: e.hasResults,
					date: withoutTime(e.date),
					winnerIsA: e.winnerIsA,
					winner: e.individualWinner.id
						? {
								id: e.individualWinner.id,
								// firstName: e.individualWinner.firstName!,
								name: e.individualWinner.lastName!,
								flag: e.individualWinner.flag!,
						  }
						: e.teamWinner
						? {
								id: e.teamWinner.id,
								name: e.teamWinner.name!,
								flag: e.teamWinner.flag!,
						  }
						: undefined,
				})),
			};
		})
	);
	return withEvents;
}

export async function getTodaysEvents() {
	console.log("!!!!!!!!!getting todays events");
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
