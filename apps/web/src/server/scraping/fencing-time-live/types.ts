export namespace LiveResults {
	export type Tableau = RoundMap<Bout>;
	export type FencerNode =
		| {
				lastName: any;
				firstName: any;
				countryCode?: any;
				seed: any;
		  }
		| "future";
	export type Round = 64 | 32 | 16 | 8 | 4 | 2;
	export type RoundMap<T> = Record<Round, T[]>;
	export type BoutJustWithFencers = {
		fencer1?: Fencer;
		fencer2?: Fencer;
	};
	export interface Bout {}

	export interface PlannedBout extends Bout {
		fencer1?: Fencer;
		fencer2?: Fencer;
	}

	export interface UnfinishedBout extends Bout {
		fencer1: Fencer;
		fencer2: Fencer;
	}

	export interface FinishedBout extends Bout {
		fencer1: ScoreFencer;
		fencer2: ScoreFencer;
		withdrawal?: boolean;
	}

	export interface Fencer {
		firstName: string;
		lastName: string;
		countryCode: string;
		seed: string;
	}
	export interface ScoreFencer extends Fencer {
		score: number | null;
	}

	export type ScoreNode =
		| {
				fencer1: number;
				fencer2: number;
		  }
		| "opponent-withdrew"
		| "future";
}
