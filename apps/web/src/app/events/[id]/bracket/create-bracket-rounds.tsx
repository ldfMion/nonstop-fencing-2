import { Round, ROUNDS } from "~/lib/models";
import { BracketCarousel } from "./bracket-carousel";
import { PageMessage } from "./page-message";
import { Match } from "./types";

/**
 * Generates bracket rounds with their respective matches, including
 * any empty matches if necessary, based on the starting round and
 * available bouts.
 */
export function createBracketRounds<T>(
	startingRound: Round,
	bouts: Match<T>[]
): { id: Round; matches: Match<T>[] }[] {
	if (bouts.length == 0) return [];
	const rounds: { id: Round; matches: Match<T>[] }[] = [];
	ROUNDS.slice(ROUNDS.indexOf(startingRound)).forEach(currRound => {
		const existingBoutsForRound = bouts.filter(
			b => Number(b.round) == currRound
		);
		const numberOfBoutsInRound = currRound / 2;
		if (existingBoutsForRound.length == numberOfBoutsInRound) {
			rounds.push({
				id: currRound,
				matches: existingBoutsForRound,
			});
		} else {
			const matchPlaceholders: Match<T>[] = new Array(
				numberOfBoutsInRound
			)
				.fill(null)
				.map((_, i) => createEmptyMatch(currRound, i));
			// i just know this works
			const positions = getPositionsForNumSeeds(numberOfBoutsInRound);
			const numExisting = existingBoutsForRound.length;
			const minSeed = numberOfBoutsInRound - numExisting + 1;
			for (let i = 0; i < numberOfBoutsInRound; i++) {
				if (positions[i] >= minSeed) {
					matchPlaceholders[i] = {
						...existingBoutsForRound.shift()!,
						order: i,
					};
				}
			}
			rounds.push({
				id: currRound,
				matches: matchPlaceholders,
			});
		}
	});
	return rounds;
}

function createEmptyMatch(round: Round, order: number) {
	return {
		round: round,
		order: order,
	};
}

function getPositionsForNumSeeds(round: number) {
	// can't find the formula/algorithm at the moment
	return (() => {
		switch (round) {
			case 1:
				return [1];
			case 2:
				return [1, 2];
			case 4:
				return [1, 4, 3, 2];
			case 8:
				return [1, 8, 5, 4, 3, 6, 7, 2];
			case 16:
				return [1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2];
			case 32:
				return [
					1, 32, 17, 16, 9, 24, 25, 8, 5, 28, 21, 12, 13, 20, 29, 4,
					3, 30, 19, 14, 11, 22, 27, 6, 7, 26, 23, 10, 15, 18, 31, 2,
				];
			default:
				throw new Error(`Unexpected round: ${round}`);
		}
	})();
}
