// import "server-only";
import { events } from "./schema";
import { db } from ".";

export type DBEventInput = typeof events.$inferInsert;

export const MUTATIONS = {
	async uploadEvents(newEvents: DBEventInput[]) {
		console.log("uploading events");
		console.log(newEvents);
		await db.insert(events).values(newEvents);
	},
};
