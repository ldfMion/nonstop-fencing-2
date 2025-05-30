"use client";
import { Round } from "~/lib/models";
import { BracketCarousel } from "./bracket-carousel";
import { createBracketRounds } from "./create-bracket-rounds";
import { HeadToHead } from "./head-to-head";
import { mapBoutToMatch } from "./map-bout-to-match";
import { BracketMatch } from "./bracket-match";

export type BracketBout = {
	fencerA?: {
		id: number;
		firstName: string;
		lastName: string;
		score?: number;
		flag?: string;
	};
	fencerB?: {
		id: number;
		firstName: string;
		lastName: string;
		score?: number;
		flag?: string;
	};
	round: Round;
	order: number;
	winnerIsA?: boolean;
	id?: number;
};

const STARTING_ROUND = 64;

export function IndividualBracket({ bouts }: { bouts: BracketBout[] }) {
	console.log("rendering individual bracket");
	const bracketData = createBracketRounds(STARTING_ROUND, bouts);
	return (
		<BracketCarousel
			bracketData={bracketData}
			renderBout={(bout, hidden) => (
				<BracketMatch
					match={mapBoutToMatch(bout)}
					hidden={hidden}
					details={
						"id" in bout &&
						bout.id &&
						"fencerA" in bout &&
						bout.fencerA &&
						"fencerB" in bout &&
						bout.fencerB ? (
							<HeadToHead
								boutId={bout.id}
								entityA={bout.fencerA}
								entityB={bout.fencerB}
							/>
						) : undefined
					}
				/>
			)}
		/>
	);
}

function createEmptyIndividualMatch(round: Round, order: number) {
	return {
		round: round,
		order: order,
		fencerA: undefined,
		fencerB: undefined,
		winnerIsA: undefined,
	};
}
