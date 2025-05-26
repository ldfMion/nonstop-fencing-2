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
} from "drizzle-orm";
import { db } from "~/infra/db";
import { competitionsWithFlagsAndEvents, events } from "~/infra/db/schema";
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
				.from(events)
				.where(
					and(
						eq(events.competition, competition.id),
						weapon ? eq(events.weapon, weapon) : undefined
					)
				)
				.orderBy(next ? asc(events.date) : desc(events.date))
				.limit(3);
			return {
				id: competition.id,
				name: competition.name,
				flag: competition.flag ?? undefined,
				events: eventRows.map(e => ({
					...e,
					date: withoutTime(e.date),
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
