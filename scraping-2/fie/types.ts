export namespace Fie {
	export type Tableau = {
		rounds: Rounds;
	}[];

	type Rounds = Record<RoundId, Bout[]>;

	type RoundId = string;
	type Bout = {
		fencer1: Fencer;
		fencer2: Fencer;
	};
	type Fencer = {
		name: string;
		id: number;
		nationality: string;
		isWinner: boolean;
		score: number;
	};
	export type Event = {
		season: number;
		competitionId: number;
		name: string;
		location: string;
		country: string;
		federation: string;
		flag: string;
		startDate: string;
		endDate: string;
		weapon: Weapon;
		weapons: Weapon[];
		gender: string;
		category: Category;
		categories: Category[];
		type: string;
		hasResults: number;
		isSubCompetition: boolean;
		isLink: boolean;
	};
	type Weapon = string;
	type Category = string;
}
