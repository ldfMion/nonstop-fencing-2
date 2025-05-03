import assert from "assert";
import puppeteer from "puppeteer";

export async function getTableauData() {
	// const url = "https://www.fencingtimelive.com/tableaus/scores/906625D1D3A8480EB245C3B059A3B06C/72F409219AAB44D4BF5259B79CAABACB/trees/6CD6DB2E13C84D1EBCD52027E402C8B0/tables/0/7";
	const url =
		"https://www.fencingtimelive.com/tableaus/scores/3769F76EFA3E4370AED992957A6C6BCE/A8B41199D3F74E1A9A3C57E71FA43253/trees/5E31594493E94D1594DBB1E7660C9407/tables/0/7";
	return scrapeTableauPage(url);
}

async function scrapeTableauPage(url: string): Promise<LiveResults.Tableau> {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	const fencerNodes = (
		await page.$$eval(".tbb, .tbbr", els =>
			els.map((el, index) =>
				el.children.length <= 1
					? null
					: {
							lastName: el.children[1].innerText,
							firstName: el.children[2].innerText,
							countryCode: el.children[3]?.innerText.trim(),
							seed: el.children[0]?.innerText
								.replace("(", "")
								.replace(")", "")
								.trim(),
							index: index,
					  }
			)
		)
	).filter(node => node != null);
	const scoreTextNodes = (
		await page.$$eval(".tscoref", els =>
			els.map(el => {
				if (el.children.length == 0) {
					return null;
				}
				const textValue = el.children[0].innerText
					.split("\n")[0]
					.trim();
				return textValue || null;
			})
		)
	).filter(el => el != null);
	browser.close();
	const scoreNodes = scoreTextNodes.map(parseScoreNode);
	const scoreNodeRounds = filterNodesForRounds(scoreNodes);
	const fencerNodeRounds = filterNodesForRounds(fencerNodes);
	const boutRounds = getBoutsFromNodeMap(fencerNodeRounds);
	const boutWithScores = addScoresToBoutMap(boutRounds, scoreNodeRounds);
	return boutWithScores;
}

namespace LiveResults {
	export type Tableau = RoundMap<BoutWithScore | BoutJustWithFencers>;
	export type FencerNode = {
		lastName: any;
		firstName: any;
		countryCode?: any;
		seed: any;
	};
	export type Round = 64 | 32 | 16 | 8 | 4 | 2;
	export type RoundMap<T> = Partial<Record<Round, T[]>>;
	export type BoutJustWithFencers = {
		fencer1: Fencer;
		fencer2: Fencer;
	};
	export type BoutWithScore = {
		fencer1: ScoreFencer;
		fencer2: ScoreFencer;
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
): LiveResults.RoundMap<
	LiveResults.BoutWithScore | LiveResults.BoutJustWithFencers
> {
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
	bouts: LiveResults.BoutJustWithFencers[] | undefined,
	scores: LiveResults.ScoreNode[] | undefined
): LiveResults.BoutWithScore[] | LiveResults.BoutJustWithFencers[] | undefined {
	if (bouts == undefined) {
		return undefined;
	}
	if (scores == undefined) {
		return bouts;
	}
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
	console.log(`score node: '${node}'`);
	if (node.toLowerCase().includes("opponent withdrew")) {
		return "opponent-withdrew";
	}
	const [fencer1, fencer2] = node.split("-").map(e => Number(e.trim()));
	assert(fencer1);
	assert(fencer2);
	return { fencer1, fencer2 };
}

function getBoutsFromNodes(
	nodes: LiveResults.FencerNode[] | undefined
): LiveResults.BoutJustWithFencers[] | undefined {
	if (nodes == undefined) {
		return undefined;
	}
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
	if (nodes.length == 0) {
		return {};
	}
	let roundNumber: LiveResults.Round = 64;
	let remaining = nodes;
	const roundMap: LiveResults.RoundMap<T> = {};
	console.log("num", remaining.length);
	while (!isPowerOf2(remaining.length)) {
		console.log("num", remaining.length);
		const [round, nextRemaining] = partitionRound(remaining);
		remaining = nextRemaining;
		roundMap[roundNumber] = round;
		roundNumber = (roundNumber / 2) as LiveResults.Round; // is this a problem?
		assert((roundNumber as number) != 1);
	}
	roundMap[roundNumber] = remaining;
	return roundMap;
}

function isPowerOf2(n: number): boolean {
	return Math.log2(n) % 1 === 0;
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
