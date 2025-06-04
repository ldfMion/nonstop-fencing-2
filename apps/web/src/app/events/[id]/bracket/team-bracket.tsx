"use client";
import { Round } from "~/lib/models";
import { BracketCarousel } from "./bracket-carousel";
import { createBracketRounds } from "./create-bracket-rounds";
import { BracketMatch } from "./bracket-match";
import { Match } from "./types";
import { HeadToHead } from "./head-to-head";
import { getRelaysBetweenTeams } from "./queries";
import { match } from "assert";

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

export function TeamBracket({
	relays,
	gender,
	weapon,
}: {
	relays: BracketMatch[];
	gender: "MEN" | "WOMEN";
	weapon: "FOIL" | "EPEE" | "SABER";
}) {
	const bracketData = createBracketRounds(STARTING_ROUND, relays);
	return (
		<BracketCarousel
			bracketData={bracketData}
			renderBout={(bout, hidden) => {
				return (
					<BracketMatch
						match={{
							top:
								"teamA" in bout && bout.teamA
									? mapTeamToMatchEntity(bout.teamA)
									: undefined,
							bottom:
								"teamB" in bout && bout.teamB
									? mapTeamToMatchEntity(bout.teamB)
									: undefined,
							winnerIsA:
								"winnerIsA" in bout
									? bout.winnerIsA
									: undefined,
						}}
						hidden={hidden}
						details={getMatchDetails({
							bout,
							weapon,
							gender,
						})}
					/>
				);
			}}
		/>
	);
}

function getMatchDetails({
	bout,
	weapon,
	gender,
}: {
	bout: Match<BracketMatch>;
	weapon: "FOIL" | "EPEE" | "SABER";
	gender: "MEN" | "WOMEN";
}) {
	if (
		"id" in bout &&
		bout.id !== undefined &&
		"teamA" in bout &&
		bout.teamA !== undefined &&
		"teamB" in bout &&
		bout.teamB !== undefined
	) {
		const teamA = bout.teamA;
		const teamB = bout.teamB;
		return (
			<HeadToHead
				boutId={bout.id}
				getMatches={async () =>
					(
						await getRelaysBetweenTeams(
							teamA.id,
							teamB.id,
							weapon,
							gender
						)
					).map(relay => ({
						...relay,
						top: mapTeamToMatchEntity(relay.teamA),
						bottom: mapTeamToMatchEntity(relay.teamB),
					}))
				}
			/>
		);
	}
	return undefined;
}

function mapTeamToMatchEntity(team: {
	id: string;
	name: string;
	score?: number;
	flag?: string;
}) {
	return {
		primaryName: team.name,
		secondaryName: "",
		score: team.score,
		flag: team.flag,
	};
}
