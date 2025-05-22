import { lte, gte, sql, desc, asc, min, max, SQL, and, eq } from "drizzle-orm";
import { db } from "~/infra/db";
import { competitionsWithFlagsAndEvents, events } from "~/infra/db/schema";

export async function getFirstCompetition(
	next: boolean,
	weapon?: "FOIL" | "EPEE" | "SABER"
) {
	const yesterday = sql`CURRENT_DATE - INTERVAL '1 day'`;
	const rows = await db
		.select({
			id: competitionsWithFlagsAndEvents.competitionId,
			name: competitionsWithFlagsAndEvents.name,
			flag: competitionsWithFlagsAndEvents.flag,
		})
		.from(competitionsWithFlagsAndEvents)
		.where(
			and(
				next
					? lte(yesterday, competitionsWithFlagsAndEvents.date)
					: gte(yesterday, competitionsWithFlagsAndEvents.date),
				weapon
					? eq(competitionsWithFlagsAndEvents.weapon, weapon)
					: undefined
			)
		)
		.orderBy(
			next
				? asc(competitionsWithFlagsAndEvents.date)
				: desc(competitionsWithFlagsAndEvents.date)
		)
		.limit(1);
	const competition = rows[0];
	if (!competition) return undefined;
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
		events: eventRows,
	};
}
