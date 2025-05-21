import { competitionsWithFlagsAndEvents } from "~/infra/db/schema";
import { db } from "~/infra/db";
import { eq } from "drizzle-orm";
import { EventModel } from "~/lib/models";

export async function getEvent(id: number): Promise<EventModel> {
	const row = (
		await db
			.select()
			.from(competitionsWithFlagsAndEvents)
			.where(eq(competitionsWithFlagsAndEvents.eventId, id))
			.limit(1)
	)[0];
	return {
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
	};
}
