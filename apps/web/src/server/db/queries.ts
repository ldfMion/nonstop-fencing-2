// import "server-only";
import { events } from "./schema";
import { db } from ".";
import { eq } from "drizzle-orm";

export type DBEventInput = typeof events.$inferInsert;

export const QUERIES = {
	async getEvents(season: number = 2025) {
		return await db.select().from(events).where(eq(events.season, season));
	},
};

export const MUTATIONS = {
	async uploadEvents(newEvents: DBEventInput[]) {
		await db.insert(events).values(newEvents);
	},
};
