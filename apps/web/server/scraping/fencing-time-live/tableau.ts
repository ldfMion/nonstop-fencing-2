import assert from "assert";
import puppeteer from "puppeteer";
import type { LiveResults } from "./types";

export async function scrapeTableauPage(
	url: string
): Promise<LiveResults.Tableau> {
	const browser = await puppeteer.launch();
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
	const fencerNodeRounds = filterNodesForRounds(fencerNodes);
	const scoreNodeRounds = filterNodesForRounds(scoreTextNodes);
	// const scoreNodeRounds = filterNodesForRounds(scoreNodes);
	// const boutRounds = getBoutsFromNodeMap(fencerNodeRounds);
	// const boutWithScores = addScoresToBoutMap(boutRounds, scoreNodeRounds);
	const bouts = parseIntoBouts(fencerNodeRounds, scoreNodeRounds);
	return bouts;
}

function parseIntoBouts(
	fencerNodeRounds: LiveResults.RoundMap<LiveResults.FencerNode>,
	scoreNodeRounds: LiveResults.RoundMap<string>
) {
	return {
		"64": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
		"32": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
		"16": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
		"8": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
		"4": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
		"2": processBoutsInRound(64, fencerNodeRounds, scoreNodeRounds),
	};
}

function processBoutsInRound(
	round: LiveResults.Round,
	fencerNodeRounds: LiveResults.RoundMap<LiveResults.FencerNode>,
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

function addScoresToBoutMap(
	boutRounds: LiveResults.RoundMap<LiveResults.BoutJustWithFencers>,
	scoreRounds: LiveResults.RoundMap<LiveResults.ScoreNode>
): LiveResults.RoundMap<LiveResults.Bout> {
	return {
		"64": addScoresToBouts(boutRounds["64"], scoreRounds["64"]),
		"32": addScoresToBouts(boutRounds["32"], scoreRounds["32"]),
		"16": addScoresToBouts(boutRounds["16"], scoreRounds["16"]),
		"8": addScoresToBouts(boutRounds["8"], scoreRounds["8"]),
		"4": addScoresToBouts(boutRounds["4"], scoreRounds["4"]),
		"2": addScoresToBouts(boutRounds["2"], scoreRounds["2"]),
	};
}

// TODO this function doesn't handle priority in epee and foil
function addScoresToBouts(
	bouts: LiveResults.BoutJustWithFencers[],
	scores: LiveResults.ScoreNode[]
): LiveResults.Bout[] {
	return bouts.map((bout, index) => {
		const score = scores[index];
		assert(score, "Score is undefined");
		switch (score) {
			case "opponent-withdrew":
				return { ...bout };
			case "future":
				return { ...bout };
			default:
				return {
					fencer1: {
						...bout.fencer1,
						score: score.fencer1,
					},
					fencer2: {
						...bout.fencer2,
						score: score.fencer2,
					},
				};
		}
	});
}

function getBoutsFromNodeMap(
	nodeRounds: LiveResults.RoundMap<LiveResults.FencerNode>
): LiveResults.RoundMap<LiveResults.BoutJustWithFencers> {
	return {
		"64": getBoutsFromNodes(nodeRounds["64"]),
		"32": getBoutsFromNodes(nodeRounds["32"]),
		"16": getBoutsFromNodes(nodeRounds["16"]),
		"8": getBoutsFromNodes(nodeRounds["8"]),
		"4": getBoutsFromNodes(nodeRounds["4"]),
		"2": getBoutsFromNodes(nodeRounds["2"]),
	};
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

function getBoutsFromNodes(
	nodes: LiveResults.FencerNode[]
): LiveResults.BoutJustWithFencers[] {
	const bouts: LiveResults.BoutJustWithFencers[] = [];
	for (let i = 0; i < nodes.length; i += 2) {
		const node1 = nodes[i];
		const node2 = nodes[i + 1];
		assert(node1, "Node 1 is undefined");
		assert(node2, "Node 2 is undefined");
		const bout = {
			fencer1:
				node1 == "future"
					? undefined
					: {
							firstName: node1.firstName,
							lastName: node1.lastName,
							countryCode: node1.countryCode,
							seed: node1.seed,
						},
			fencer2:
				node2 == "future"
					? undefined
					: {
							firstName: node2.firstName,
							lastName: node2.lastName,
							countryCode: node2.countryCode,
							seed: node2.seed,
						},
		};
		bouts.push(bout);
	}
	return bouts;
}

function filterNodesForRounds<T>(nodes: T[]): LiveResults.RoundMap<T> {
	const [round64, remaining1] = partitionRound(nodes);
	const [round32, remaining2] = partitionRound(remaining1);
	const [round16, remaining3] = partitionRound(remaining2);
	const [round8, remaining4] = partitionRound(remaining3);
	const [round4, remaining5] = partitionRound(remaining4);
	const [round2, _] = partitionRound(remaining5);
	return {
		"64": round64,
		"32": round32,
		"16": round16,
		"8": round8,
		"4": round4,
		"2": round2,
	};
}

function partitionRound<T>(nodes: T[]): [T[], T[]] {
	const [firstHalf, secondHalf] = splitArray(nodes);
	if (nodes.length == 1) {
		const onlyNode = nodes[0];
		assert(onlyNode);
		return [[onlyNode], []];
	}
	// idk why this is different from [filterEven(nodes), filterOdd(nodes)]
	return [
		filterEven(firstHalf).concat(filterOdd(secondHalf)),
		filterOdd(firstHalf).concat(filterEven(secondHalf)),
	];
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
