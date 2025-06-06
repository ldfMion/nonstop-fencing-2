import {
	competitions,
	events,
	fencers,
	liveBouts,
	pastBouts,
} from "../infra/db/schema";
export type EventModel = typeof events.$inferSelect & {
	season: number;
	name: string;
	flag?: string;
};

export type NewEventModel = typeof events.$inferInsert;

export type NewCompetitionModel = typeof competitions.$inferInsert;

export type NewFencerModel = typeof fencers.$inferInsert;

export type FencerModel = typeof fencers.$inferSelect;

export type NewLiveBoutModel = typeof liveBouts.$inferInsert;

export type NewPastBoutModel = typeof pastBouts.$inferInsert;

export const ROUNDS = [64, 32, 16, 8, 4, 2] as const;
export type Round = (typeof ROUNDS)[number];

export type PastBoutModel = {
	fencerA: {
		id: number;
		firstName: string;
		lastName: string;
		score: number;
		flag?: string;
	};
	fencerB: {
		id: number;
		firstName: string;
		lastName: string;
		score: number;
		flag?: string;
	};
	round: Round;
	order: number;
	winnerIsA: boolean;
	id: number;
};

export type Competition = {
	id: number;
	name: string;
	flag?: string;
	weapons: ("FOIL" | "EPEE" | "SABER")[];
	types: ("INDIVIDUAL" | "TEAM")[];
	genders: ("MEN" | "WOMEN")[];
	date: {
		start: Date;
		end: Date;
	};
};
