export namespace LiveResults {
	export type Tableau = RoundMap<BoutWithScore | BoutJustWithFencers>;
	export type FencerNode = {
		lastName: any;
		firstName: any;
		countryCode?: any;
		seed: any;
	} | null;
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
