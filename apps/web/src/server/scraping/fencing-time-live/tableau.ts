import assert from "assert";
import type * as LiveResults from "./types";
import { browserless } from "../browserless";

export async function scrapeTableauPage(
	url: string
): Promise<LiveResults.Tableau> {
	const browser = await browserless();
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	const fencerNodes = await page.$$eval(".tbb, .tbbr", els =>
		els.map((el, index) =>
			el.children.length <= 1
				? "future"
				: {
						// @ts-expect-error puppeteer children[n] object
						lastName: el.children[1].innerText,
						// @ts-expect-error puppeteer children[n] object
						firstName: el.children[2].innerText,
						// @ts-expect-error puppeteer children[n] object
						countryCode: el.children[3]?.innerText.trim(),
						// @ts-expect-error puppeteer children[n].innerText object
						seed: el.children[0]?.innerText
							.replace("(", "")
							.replace(")", "")
							.trim(),
						index: index,
					}
		)
	);
	const scoreTextNodes = (
		await page.$$eval(".tscoref", els =>
			els.map(el => {
				if (el.children.length == 0) {
					return null;
				}
				// @ts-expect-error puppeteer children[n] object
				const textValue = el.children[0].innerText
					.split("\n")[0]
					.trim();
				return textValue || "future";
			})
		)
	).filter(el => el != null);
	// console.log("Number of fencerNodes: ", fencerNodes.length);
	// console.log("Number of scoreTextNodes: ", scoreTextNodes.length);
	browser.close();
	// const scoreNodes = scoreTextNodes.map(parseScoreNode);
	const fencerNodeRounds = filterFencerNodesForRounds(fencerNodes);
	const scoreNodeRounds = filterNodesForRounds(scoreTextNodes);
	// const scoreNodeRounds = filterNodesForRounds(scoreNodes);
	// const boutRounds = getBoutsFromNodeMap(fencerNodeRounds);
	// const boutWithScores = addScoresToBoutMap(boutRounds, scoreNodeRounds);
	const bouts = parseIntoBouts(fencerNodeRounds, scoreNodeRounds);
	return bouts;
}

function parseIntoBouts(
	fencerNodeRounds: Record<
		LiveResults.FencerNodeRound,
		LiveResults.FencerNode[]
	>,
	scoreNodeRounds: LiveResults.RoundMap<string>
) {
	return {
		"64": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
		"32": processBoutsInRound(32, fencerNodeRounds, scoreNodeRounds),
		"16": processBoutsInRound(16, fencerNodeRounds, scoreNodeRounds),
		"8": processBoutsInRound(8, fencerNodeRounds, scoreNodeRounds),
		"4": processBoutsInRound(4, fencerNodeRounds, scoreNodeRounds),
		"2": processBoutsInRound(2, fencerNodeRounds, scoreNodeRounds),
	};
}

function processBoutsInRound(
	round: LiveResults.Round,
	fencerNodeRounds: Record<
		LiveResults.FencerNodeRound,
		LiveResults.FencerNode[]
	>,
	scoreNodeRounds: LiveResults.RoundMap<string>
): LiveResults.Bout[] {
	const fencerNodes = fencerNodeRounds[round];
	const scoreNodes = scoreNodeRounds[round];
	const bouts = new Array(round);
	for (let i = 0; i < fencerNodes.length; i += 2) {
		const fencerNode1 = fencerNodes[i];
		const fencerNode2 = fencerNodes[i + 1];
		const scoreNode = scoreNodes[Math.floor(i / 2)];
		assert(fencerNode1, "Node 1 is undefined");
		assert(fencerNode2, "Node 2 is undefined");
		assert(scoreNode, "scoreNode is undefined");
		const parsedScore = parseScoreNode(scoreNode);
		const winnerFencerNode =
			fencerNodeRounds[(round / 2) as LiveResults.Round][i / 2];
		assert(winnerFencerNode, "winnerFencerNode is undefined");
		const hasWinner = winnerFencerNode != "future";
		const fencer1IsWinner =
			winnerFencerNode != "future" &&
			fencerNode1 != "future" &&
			winnerFencerNode.lastName == fencerNode1.lastName;
		const fencer2IsWinner =
			winnerFencerNode != "future" &&
			fencerNode2 != "future" &&
			winnerFencerNode.lastName == fencerNode2.lastName;
		const fencer1Score =
			parsedScore != "future" && parsedScore != "opponent-withdrew"
				? fencer1IsWinner
					? parsedScore.fencer1
					: parsedScore.fencer2
				: undefined;
		const fencer2Score =
			parsedScore != "future" && parsedScore != "opponent-withdrew"
				? fencer2IsWinner
					? parsedScore.fencer1
					: parsedScore.fencer2
				: undefined;
		const bout = {
			withdrawal: parsedScore == "opponent-withdrew",
			fencer1:
				fencerNode1 == "future"
					? undefined
					: {
							firstName: fencerNode1.firstName,
							lastName: fencerNode1.lastName,
							countryCode: fencerNode1.countryCode,
							seed: fencerNode1.seed,
							winner: hasWinner ? fencer1IsWinner : undefined,
							score: fencer1Score,
						},
			fencer2:
				fencerNode2 == "future"
					? undefined
					: {
							firstName: fencerNode2.firstName,
							lastName: fencerNode2.lastName,
							countryCode: fencerNode2.countryCode,
							seed: fencerNode2.seed,
							winner: hasWinner ? fencer2IsWinner : undefined,
							score: fencer2Score,
						},
		};
		bouts[i / 2] = bout;
	}
	return bouts;
}

function parseScoreNode(node: string): LiveResults.ScoreNode {
	if (node == "future") {
		return "future";
	}
	if (node.toLowerCase().includes("opponent withdrew")) {
		return "opponent-withdrew";
	}
	const [fencer1, fencer2] = node.split("-").map(e => Number(e.trim()));
	assert(fencer1);
	assert(fencer2);
	return { fencer1, fencer2 };
}

function filterNodesForRounds<T>(nodes: T[]): LiveResults.RoundMap<T> {
	const [round64, remaining1] = partitionRound(nodes);
	const [round32, remaining2] = partitionRound(remaining1);
	const [round16, remaining3] = partitionRound(remaining2);
	const [round8, remaining4] = partitionRound(remaining3);
	const [round4, remaining5] = partitionRound(remaining4);
	const [round2] = partitionRound(remaining5);
	return {
		"64": round64,
		"32": round32,
		"16": round16,
		"8": round8,
		"4": round4,
		"2": round2,
	};
}

function filterFencerNodesForRounds(
	nodes: LiveResults.FencerNode[]
): Record<LiveResults.FencerNodeRound, LiveResults.FencerNode[]> {
	const [round64, remaining1] = partitionRound(nodes);
	const [round32, remaining2] = partitionRound(remaining1);
	const [round16, remaining3] = partitionRound(remaining2);
	const [round8, remaining4] = partitionRound(remaining3);
	const [round4, remaining5] = partitionRound(remaining4);
	const [round2, final] = partitionRound(remaining5);
	return {
		"64": round64,
		"32": round32,
		"16": round16,
		"8": round8,
		"4": round4,
		"2": round2,
		"1": final,
	};
}

function partitionRound<T>(nodes: T[]): [T[], T[]] {
	const [firstHalf, secondHalf] = splitArray(nodes);
	if (nodes.length == 1) {
		const onlyNode = nodes[0];
		assert(onlyNode);
		return [[onlyNode], []];
	}
	const result: [T[], T[]] = [
		filterEven(firstHalf).concat(filterOdd(secondHalf)),
		filterOdd(firstHalf).concat(filterEven(secondHalf)),
	];
	// idk why this is different from [filterEven(nodes), filterOdd(nodes)]
	return result;
}

function filterEven<T>(nodes: T[]): T[] {
	return nodes.filter((_, index) => index % 2 == 0);
}
function filterOdd<T>(nodes: T[]): T[] {
	return nodes.filter((_, index) => index % 2 == 1);
}

function splitArray<T>(yourArray: T[]): [T[], T[]] {
	const halfwayThrough = Math.floor(yourArray.length / 2);
	// or instead of floor you can use ceil depending on what side gets the extra data

	const arrayFirstHalf = yourArray.slice(0, halfwayThrough);
	const arraySecondHalf = yourArray.slice(halfwayThrough, yourArray.length);
	return [arrayFirstHalf, arraySecondHalf];
}
