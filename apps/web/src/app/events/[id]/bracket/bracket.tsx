import { LiveBoutModel, Round } from "~/lib/models";
import { BracketCarousel } from "./bracket-carousel";

export type BracketBout = Omit<LiveBoutModel, "id">;

export function Bracket({
	bouts,
}: {
	bouts: LiveBoutModel[];
	isLive?: boolean;
}) {
	if (bouts.length == 0) {
		return "Bracket not available";
	}
	const bracketBouts = createTableauBouts(64, bouts);
	const rounds = bracketBouts.reduce(
		(acc, bout) => {
			if (!acc[bout.round]) {
				acc[bout.round] = [];
			}
			acc[bout.round]!.push(bout);
			return acc;
		},
		{} as Record<BracketBout["round"], BracketBout[]>
	);

	// Sort bouts within each round by their order
	Object.keys(rounds).forEach(roundKey => {
		rounds[roundKey as BracketBout["round"]].sort(
			(a, b) => a.order - b.order
		);
	});

	// Determine the order of rounds to display (largest first)
	const sortedRoundKeys: BracketBout["round"][] = [
		"64",
		"32",
		"16",
		"8",
		"4",
		"2",
	].filter(
		roundKey =>
			rounds[roundKey as Round] && rounds[roundKey as Round].length > 0
	) as Round[];
	if (sortedRoundKeys.length === 0) {
		return (
			<div className="text-center text-muted-foreground">
				No bracket data available.
			</div>
		);
	}
	return (
		<BracketCarousel sortedRoundKeys={sortedRoundKeys} rounds={rounds} />
	);
}

function createTableauBouts(
	startingRound: number,
	bouts: LiveBoutModel[]
): BracketBout[] {
	let currRound = startingRound;
	const tableau: BracketBout[] = [];
	while (currRound > 1) {
		const numBouts = currRound / 2;
		const bouts = new Array(numBouts).fill(null).map((_, i) => ({
			round: currRound.toString() as Round,
			order: i,
			fencerA: undefined,
			fencerB: undefined,
			winnerIsA: undefined,
		}));
		tableau.push(...bouts);
		currRound /= 2;
	}
	bouts.forEach(b => {
		tableau[
			tableau.findIndex(t => t.order === b.order && t.round === b.round)
		] = b;
	});
	return tableau;
}
