import { withoutTime } from "~/lib/utils";
import { eventsWithWinners } from "./queries";
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

export function mapEventWithWinner(e: {
	id: number;
	competition: number;
	weapon: "FOIL" | "EPEE" | "SABER";
	gender: "MEN" | "WOMEN";
	type: "INDIVIDUAL" | "TEAM";
	date: Date;
	hasResults: boolean;
	individualWinner: {
		id: number | null;
		firstName: string | null;
		lastName: string | null;
		flag: string;
	};
	teamWinner: {
		id: string | null;
		name: string | null;
		flag: string | null;
	};
	winnerIsA: boolean | null;
}) {
	return {
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
			: e.teamWinner.id
			? {
					id: e.teamWinner.id,
					name: e.teamWinner.name!,
					flag: e.teamWinner.flag!,
			  }
			: undefined,
	};
}
