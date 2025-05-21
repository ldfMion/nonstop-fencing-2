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
export type FencerNodeRound = Round | 1;
export type RoundMap<T> = Record<Round, T[]>;
export type BoutJustWithFencers = {
	fencer1?: Fencer;
	fencer2?: Fencer;
};
export interface Bout {
	fencer1?: Fencer;
	fencer2?: Fencer;
	withdrawal?: boolean;
}
export interface Fencer {
	firstName: string;
	lastName: string;
	countryCode: string;
	seed: string;
	score?: number;
	winner?: boolean;
}

export type ScoreNode =
	| {
			fencer1: number;
			fencer2: number;
	  }
	| "opponent-withdrew"
	| "future";
