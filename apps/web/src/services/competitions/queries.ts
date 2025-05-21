import {
	competitions,
	competitionsWithFlag,
	competitionsWithFlagsAndEvents,
	countries,
	events,
	fencers,
	liveBouts,
	pastBouts,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { sql, eq, isNull, not, type SQL, inArray, and, lte } from "drizzle-orm";
import {
	NewEventModel,
	NewCompetitionModel,
	EventModel,
	NewLiveBoutModel,
	NewPastBoutModel,
} from "~/lib/models";

export async function insertEvents(newEvents: NewEventModel[]) {
	console.log("inserting events");
	console.log(
		await db
			.insert(events)
			.values(newEvents)
			.onConflictDoUpdate({
				target: [events.fieCompetitionId],
				set: {
					date: sql`EXCLUDED.date`,
					hasFieResults: sql`EXCLUDED.has_fie_results`,
				},
			})
	);
	db.refreshMaterializedView(competitionsWithFlagsAndEvents);
}
export async function insertCompetitions(
	newCompetitions: NewCompetitionModel[]
) {
	const result = await db
		.insert(competitions)
		.values(newCompetitions)
		.returning({ name: competitions.name, id: competitions.id })
		.onConflictDoUpdate({
			target: [competitions.id],
			set: { name: sql`EXCLUDED.name`, host: sql`EXCLUDED.host` },
		});
	await db.refreshMaterializedView(competitionsWithFlag);
	db.refreshMaterializedView(competitionsWithFlagsAndEvents);
	return result;
}
