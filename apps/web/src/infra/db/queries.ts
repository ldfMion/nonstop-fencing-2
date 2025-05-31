import { aliasedTable, eq, and, or, sql } from "drizzle-orm";
import { db } from ".";
import {
	countries,
	events,
	fencers,
	pastBouts,
	pastTeamRelays,
} from "./schema";

const countries2 = aliasedTable(countries, "countries2");

export const eventsWithWinners = db
	.select({
		id: sql<number>`events_0.id`.as("event_id"), // events.id,
		competition: events.competition,
		weapon: events.weapon,
		gender: events.gender,
		type: events.type,
		date: events.date,
		hasResults: events.hasResults,
		individualWinner: {
			id: fencers.id,
			firstName: fencers.firstName,
			lastName: fencers.lastName,
			flag: sql<string>`countries_0.iso_code`.as(
				"individual_winner_flag"
			), // countries.isoCode,
		},
		teamWinner: {
			id: countries2.iocCode,
			name: countries2.name,
			flag: countries2.isoCode,
		},
		winnerIsA: pastBouts.winnerIsA,
	})
	.from(events)
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
	.where(
		or(
			eq(events.hasResults, false),
			eq(pastBouts.round, "2"),
			and(
				eq(pastTeamRelays.round, "2"),
				eq(pastTeamRelays.bracket, "MAIN")
			)
		)
	)
	.as("events_with_winners");
