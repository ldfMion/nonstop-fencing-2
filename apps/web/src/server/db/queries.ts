// import "server-only";
import { competitions, countries, events } from "./schema";
import { db } from ".";

export type DBEventInput = typeof events.$inferInsert;

export const QUERIES = {
	async getCompetitions(season: number = 2025) {
		return (
			await db.query.competitions.findMany({
				where: (c, { eq }) => eq(c.season, season),
				with: {
					events: true,
					host: true,
				},
			})
		).map(c => ({ ...c, flag: c.host.isoCode, host: null }));
	},
};

export const MUTATIONS = {
	async uploadEvents(newEvents: DBEventInput[]) {
		await db.insert(events).values(newEvents);
	},
};
