"use client";
import { Round } from "~/lib/models";
import { BracketCarousel } from "./bracket-carousel";
import { createBracketRounds } from "./create-bracket-rounds";
import { BracketMatch } from "./bracket-match";

const STARTING_ROUND = 32;

type BracketMatch = {
	teamA?: {
		id: string;
		name: string;
		score?: number;
		flag?: string;
	};
	teamB?: {
		id: string;
		name: string;
		score?: number;
		flag?: string;
	};
	round: Round;
	order: number;
	winnerIsA?: boolean;
	id?: number;
};

export function TeamBracket({ relays }: { relays: BracketMatch[] }) {
	console.log("rendering team bracket");
	const bracketData = createBracketRounds(STARTING_ROUND, relays);
	return (
		<BracketCarousel
			bracketData={bracketData}
			renderBout={(bout, hidden) => (
				<BracketMatch
					match={{
						top:
							"teamA" in bout && bout.teamA
								? {
										primaryName: bout.teamA.name,
										secondaryName: "",
										score: bout.teamA.score,
										flag: bout.teamA.flag,
								  }
								: undefined,
						bottom:
							"teamB" in bout && bout.teamB
								? {
										primaryName: bout.teamB.name,
										secondaryName: "",
										score: bout.teamB.score,
										flag: bout.teamB.flag,
								  }
								: undefined,
						winnerIsA:
							"winnerIsA" in bout ? bout.winnerIsA : undefined,
					}}
					hidden={hidden}
				/>
			)}
		/>
	);
}
