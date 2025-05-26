import { z } from "zod";
import { filterEven, filterOdd, splitArray } from "../utils";
import assert from "assert";
import { Tableau } from "./tableau";

export function parseFencerNodes(
	fencerNodesTo16: unknown[],
	fencerNodesToFinal: unknown[]
) {
	// const validated = fencerNodesSchema.parse(fencerNodes);
	let round = 64;
	const tableau = new Tableau<any>(round);
	const [r64, remaining] = partitionRound(fencerNodesTo16);
	tableau.addRoundInOrder(fencersToBouts(r64));
	const [r32] = partitionRound(remaining);
	console.log(r32);
	tableau.addRoundInOrder(fencersToBouts(r32));
	const [r16, remaining3] = partitionRound(fencerNodesToFinal);
	console.log(r16);
	tableau.addRoundInOrder(fencersToBouts(r16));
	const [r8, remaining4] = partitionRound(remaining3);
	tableau.addRoundInOrder(fencersToBouts(r8));
	const [r4, remaining5] = partitionRound(remaining4);
	tableau.addRoundInOrder(fencersToBouts(r4));
	const [r2] = partitionRound(remaining5);
	tableau.addRoundInOrder(fencersToBouts(r2));
	tableau.print();
}

function fencersToBouts(fencers: unknown[]) {
	const bouts = new Array<{ fencerA: unknown; fencerB: unknown }>(
		fencers.length / 2
	);
	for (let i = 0; i < fencers.length; i += 2) {
		const parsedA = fencerSchema.safeParse(fencers[i]);
		if (parsedA.error) {
			console.error(
				`Failed to parse fencer ${fencers[i]} ${parsedA.error}`
			);
			console.log(fencers[i]);
			throw new Error();
		}
		const parsedB = fencerSchema.safeParse(fencers[i + 1]);
		if (parsedB.error) {
			console.error(
				`Failed to parse fencer ${fencers[i + 1]} ${parsedB.error}`
			);
			console.log(fencers[i + 1]);
			throw new Error();
		}
		bouts[i / 2] = {
			fencerA: {
				text: parsedA.data.fencerText,
				country: parsedA.data.country,
			},
			fencerB: {
				text: parsedB.data.fencerText,
				country: parsedB.data.country,
				score: parsedB.data.scoreText,
			},
		};
	}
	return bouts;
}

const fencerSchema = z.object({
	fencerText: z.string(),
	country: z.string().length(3).optional(),
	scoreText: z.string().optional(),
});

function partitionRound<T>(nodes: T[]): [T[], T[]] {
	if (nodes.length == 1) {
		const onlyNode = nodes[0];
		assert(onlyNode);
		return [[onlyNode], []];
	}
	const result: [T[], T[]] = [filterOdd(nodes), filterEven(nodes)];
	return result;
}
