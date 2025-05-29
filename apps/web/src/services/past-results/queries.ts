import {
	competitionsWithFlagsAndEvents,
	events,
	pastTeamRelays,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { eq, and, lte, inArray } from "drizzle-orm";

export async function getEventsWithMissingResults() {
	let yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday = new Date(yesterday.toISOString().split("T")[0]);
	return (
		await db
			.select()
			.from(competitionsWithFlagsAndEvents)
			.where(
				and(
					eq(competitionsWithFlagsAndEvents.hasResults, false),
					lte(competitionsWithFlagsAndEvents.date, yesterday)
				)
			)
	).map(row => ({
		id: row.eventId,
		competition: row.competitionId,
		weapon: row.weapon,
		date: row.date,
		type: row.type,
		gender: row.gender,
		hasFieResults: row.hasFieResults,
		lastLiveUpdate: row.lastLiveUpdate,
		liveResultsTableauUrl: row.liveResultsTableauUrl,
		season: row.season,
		name: row.name,
		flag: row.flag ?? undefined,
		fieCompetitionId: row.fieCompetitionId,
		hasResults: row.hasResults,
	}));
}

export async function savePastTeamRelays(relays: NewRelayDto[]) {
	if (relays.length == 0) {
		return;
	}
	console.log("inserting past bouts");
	console.log(
		await db.transaction(tx =>
			tx
				.insert(pastTeamRelays)
				.values(relays)
				.onConflictDoNothing({
					target: [
						pastTeamRelays.event,
						pastTeamRelays.order,
						pastTeamRelays.bracket,
						pastTeamRelays.round,
					],
				})
		)
	);
}

export type NewRelayDto = typeof pastTeamRelays.$inferInsert;

export async function updateEventsResultsInformation(eventIds: number[]) {
	await db
		.update(events)
		.set({ hasResults: true, hasFieResults: true })
		.where(inArray(events.id, eventIds));
	await db.refreshMaterializedView(competitionsWithFlagsAndEvents);
}
