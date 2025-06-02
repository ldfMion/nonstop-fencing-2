import { getIndividualRankings, getTeamRankings } from "~/infra/scraping/fie";

export async function updateRankings() {
	getIndividualRankings({ season: 2025, gender: "MEN", weapon: "FOIL" });
	getTeamRankings({ season: 2025, gender: "MEN", weapon: "FOIL" });
}
