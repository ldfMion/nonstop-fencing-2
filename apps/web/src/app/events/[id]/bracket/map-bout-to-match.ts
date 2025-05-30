import { BracketBout } from "./individual-bracket";

export function mapBoutToMatch(bout: BracketBout) {
	return {
		top:
			"fencerA" in bout && bout.fencerA
				? {
						primaryName: bout.fencerA.firstName,
						secondaryName: bout.fencerA.lastName,
						score: bout.fencerA.score,
						flag: bout.fencerA.flag,
				  }
				: undefined,
		bottom:
			"fencerB" in bout && bout.fencerB
				? {
						primaryName: bout.fencerB.firstName,
						secondaryName: bout.fencerB.lastName,
						score: bout.fencerB.score,
						flag: bout.fencerB.flag,
				  }
				: undefined,
		winnerIsA: "winnerIsA" in bout ? bout.winnerIsA : undefined,
	};
}
