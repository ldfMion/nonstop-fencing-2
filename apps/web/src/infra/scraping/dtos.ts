import { pastTeamRelays } from "../db/schema";
export interface ScrapedPastTeamRelayDto {
	teamACode: string;
	teamBCode: string;
	teamAScore: number;
	teamBScore: number;
	winnerIsA: boolean;
	bracket: Bracket;
	round: Round;
	order: number;
}

type Bracket = (typeof pastTeamRelays.$inferSelect)["bracket"];
type Round = (typeof pastTeamRelays.$inferSelect)["round"];

export type ScrapedPastTeamEventDto = ScrapedPastTeamRelayDto[];

export interface ScrapedIndividualRankingDto {
	fencer: {
		firstName: string;
		lastName: string;
		country: string;
	};
	position: string;
}
