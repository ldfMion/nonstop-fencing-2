import { events, fencers, liveBouts } from "./server/db/schema";
export type EventModel = typeof events.$inferSelect & {
	season: number;
	name: string;
	flag?: string;
};

export type NewFencerModel = typeof fencers.$inferInsert;

export type FencerModel = typeof fencers.$inferSelect;

export type NewBoutModel = typeof liveBouts.$inferInsert;

export type Round = "2" | "4" | "8" | "16" | "32" | "64";

export type BoutModel = {
	fencerA?: {
		firstName: string;
		lastName: string;
		score?: number;
		flag?: string;
	};
	fencerB?: {
		firstName: string;
		lastName: string;
		score?: number;
		flag?: string;
	};
	round: Round;
	order: number;
	winnerIsA?: boolean;
	id: number;
};
