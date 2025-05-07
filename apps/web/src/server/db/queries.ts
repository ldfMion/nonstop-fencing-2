// import "server-only";
import { events } from "./schema";
import { db } from ".";

export type DBEventInput = typeof events.$inferInsert;

export const MUTATIONS = {
	async uploadEvents(newEvents: DBEventInput[]) {
		await db.insert(events).values(newEvents);
	},
};
