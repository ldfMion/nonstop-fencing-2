import { events, fencers, liveBouts } from "./server/db/schema";
export type EventModel = typeof events.$inferSelect & {
	season: number;
};

export type NewFencerModel = typeof fencers.$inferInsert;

export type FencerModel = typeof fencers.$inferSelect;

export type NewBoutModel = typeof liveBouts.$inferInsert;
