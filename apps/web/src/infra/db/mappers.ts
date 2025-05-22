import { competitionsWithFlagsAndEvents } from "./schema";

export function mapToEventModel(
	row: typeof competitionsWithFlagsAndEvents.$inferSelect
) {
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

export async function mapSingleEvent(
	rows: Promise<(typeof competitionsWithFlagsAndEvents.$inferSelect)[]>
) {
	return mapToEventModel((await rows)[0]);
}
