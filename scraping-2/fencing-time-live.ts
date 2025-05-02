import assert from "assert";
import puppeteer from "puppeteer";

export async function getTableauData() {
	const url =
		"https://www.fencingtimelive.com/tableaus/scores/906625D1D3A8480EB245C3B059A3B06C/72F409219AAB44D4BF5259B79CAABACB/trees/6CD6DB2E13C84D1EBCD52027E402C8B0/tables/0/7";
	return scrapeTableauPage(url);
}

async function scrapeTableauPage(url: string): Promise<LiveResults.Tableau> {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	const fencerNodes = await page.$$eval(".tbb, .tbbr", els =>
		els.map((el, index) => ({
			lastName: el.children[1].innerText,
			firstName: el.children[2].innerText,
			countryCode: el.children[3]?.innerText.trim(),
			seed: el.children[0]?.innerText
				.replace("(", "")
				.replace(")", "")
				.trim(),
			index: index,
		}))
	);
	const scoreTextNodes = (
		await page.$$eval(".tscoref", els =>
			els.map(el => el.children[0]?.innerText.split("\n")[0])
		)
	).filter(el => el != null);
	browser.close();
	console.log(scoreTextNodes.length);
	const scoreNodes = scoreTextNodes.map(parseScoreNode);
	const scoreNodeRounds = filterNodesForRounds(scoreNodes);
	const fencerNodeRounds = filterNodesForRounds(fencerNodes);
	const boutRounds = getBoutsFromNodeMap(fencerNodeRounds);
	const boutWithScores = addScoresToBoutMap(boutRounds, scoreNodeRounds);
	return boutWithScores;
}

namespace LiveResults {
	export type Tableau = RoundMap<BoutWithScore>;
	export type FencerNode = {
		lastName: any;
		firstName: any;
		countryCode?: any;
		seed: any;
	};
	type Round = 64 | 32 | 16 | 8 | 4 | 2;
	export type RoundMap<T> = Record<Round, T[]>;
	export type BoutJustWithFencers = {
		fencer1: Fencer;
		fencer2: Fencer;
	};
	export type BoutWithScore = {
		fencer1: Fencer;
		fencer2: Fencer;
		withdrawal?: boolean;
	};
	export type Fencer = {
		firstName: string;
		lastName: string;
		countryCode: string;
		seed: string;
	};
	export type ScoreFencer = Fencer & {
		score: number | null;
		winner: boolean;
	};

	export type ScoreNode =
		| {
				fencer1: number;
				fencer2: number;
		  }
		| "opponent-withdrew";
}

function addScoresToBoutMap(
	boutRounds: LiveResults.RoundMap<LiveResults.BoutJustWithFencers>,
	scoreRounds: LiveResults.RoundMap<LiveResults.ScoreNode>
): LiveResults.RoundMap<LiveResults.BoutWithScore> {
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
): LiveResults.BoutWithScore[] {
	return bouts.map((bout, index) => {
		const score = scores[index];
		assert(score, "Score is undefined");
		return {
			fencer1: {
				...bout.fencer1,
				score: score == "opponent-withdrew" ? null : score.fencer1,
				winner:
					score == "opponent-withdrew"
						? false
						: score.fencer1 > score.fencer2,
			},
			fencer2: {
				...bout.fencer2,
				score: score == "opponent-withdrew" ? null : score.fencer2,
				winner:
					score == "opponent-withdrew"
						? false
						: score.fencer2 > score.fencer1,
			},
		};
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
			fencer1: {
				firstName: node1.firstName,
				lastName: node1.lastName,
				countryCode: node1.countryCode,
				seed: node1.seed,
			},
			fencer2: {
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
	const [round64, remaining] = partitionRound(nodes);
	// console.log(round64);
	// throw new Error("Stop");
	const [round32, remaining2] = partitionRound(remaining);
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
		console.log("nodes has length 1");
		console.log("firstHalf", firstHalf);
		console.log("secondHalf", secondHalf);
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
	let halfwayThrough = Math.floor(yourArray.length / 2);
	// or instead of floor you can use ceil depending on what side gets the extra data

	let arrayFirstHalf = yourArray.slice(0, halfwayThrough);
	let arraySecondHalf = yourArray.slice(halfwayThrough, yourArray.length);
	return [arrayFirstHalf, arraySecondHalf];
}
