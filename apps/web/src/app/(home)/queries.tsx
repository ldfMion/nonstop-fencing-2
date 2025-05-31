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
				.limit(3);
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
