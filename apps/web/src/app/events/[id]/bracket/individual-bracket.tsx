"use client";
import { Round } from "~/lib/models";
import { BracketCarousel } from "./bracket-carousel";
import { createBracketRounds } from "./create-bracket-rounds";
import { HeadToHead } from "./head-to-head";
import { BracketMatch } from "./bracket-match";
import { getBoutsBetweenFencers } from "./queries";
import { MatchCard } from "./match-card";
import { buttonVariants } from "~/components/ui/button";
import { cn, formatRelativeDate } from "~/lib/utils";
import { RoundBadge } from "../../../../components/custom/round-badge";
import { router } from "~/lib/router";
import Link from "next/link";
import { Match } from "./types";

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
	const bracketData = createBracketRounds(STARTING_ROUND, bouts);
	return (
		<BracketCarousel
			bracketData={bracketData}
			renderBout={(bout, hidden) => (
				<BracketMatch
					match={mapBoutToMatch(bout)}
					hidden={hidden}
					details={getMatchDetails(bout)}
				/>
			)}
		/>
	);
}

function getMatchDetails(bout: Match<BracketBout>) {
	if (
		"id" in bout &&
		bout.id !== undefined &&
		"fencerA" in bout &&
		bout.fencerA !== undefined &&
		"fencerB" in bout &&
		bout.fencerB !== undefined
	) {
		const fencerA = bout.fencerA;
		const fencerB = bout.fencerB;
		return (
			<HeadToHead
				boutId={bout.id}
				getMatches={async () =>
					(await getBoutsBetweenFencers(fencerA.id, fencerB.id)).map(
						b => ({
							...b,
							top: mapFencerToMatchEntity(b.fencerA),
							bottom: mapFencerToMatchEntity(b.fencerB),
						})
					)
				}
			/>
		);
	}
	return undefined;
}

function mapBoutToMatch(bout: BracketBout) {
	return {
		...bout,
		top:
			"fencerA" in bout && bout.fencerA
				? mapFencerToMatchEntity(bout.fencerA)
				: undefined,
		bottom:
			"fencerB" in bout && bout.fencerB
				? mapFencerToMatchEntity(bout.fencerB)
				: undefined,
		winnerIsA: "winnerIsA" in bout ? bout.winnerIsA : undefined,
	};
}

function mapFencerToMatchEntity(fencer: {
	id: number;
	firstName: string;
	score?: number;
	lastName: string;
	flag?: string;
}) {
	return {
		primaryName: fencer.lastName,
		secondaryName: fencer.firstName,
		flag: fencer.flag,
		score: fencer.score,
	};
}
