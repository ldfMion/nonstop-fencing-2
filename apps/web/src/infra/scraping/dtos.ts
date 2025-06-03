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

interface ScrapedRankingItemDto {
	position: number;
	weapon: "FOIL" | "EPEE" | "SABER";
	gender: "MEN" | "WOMEN";
	season: number;
	points: string;
}

interface ScrapedIndividualRankingItemDto extends ScrapedRankingItemDto {
	fencer: {
		firstName: string;
		lastName: string;
		country: string;
	};
}

export type ScrapedIndividualRankingDto = ScrapedIndividualRankingItemDto[];

interface ScrapedTeamRankingItemDto extends ScrapedRankingItemDto {
	team: string;
}

export type ScrapedTeamRankingDto = ScrapedTeamRankingItemDto[];
