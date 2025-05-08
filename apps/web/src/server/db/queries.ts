// import "server-only";
// import { competitions, countries, events } from "./schema";
import { events } from "./schema";
import { db } from ".";
import { Competition } from "~/app/events/events-list";

export type DBEventInput = typeof events.$inferInsert;

export const QUERIES = {
	async getCompetitions(season: number = 2025): Promise<Competition[]> {
		return (
			await db.query.competitions.findMany({
				where: (c, { eq }) => eq(c.season, season),
				with: {
					events: {
						orderBy: (events, { asc }) => [asc(events.date)],
					},
					host: true,
				},
			})
		).map(c => ({
			id: c.id,
			name: c.name,
			flag: c.host.isoCode,
			weapons: [...new Set(c.events.map(e => e.weapon))],
			types: [...new Set(c.events.map(e => e.type))],
			genders: [...new Set(c.events.map(e => e.gender))],
			date: {
				start: c.events[0]!.date,
				end: c.events.at(-1)!.date,
			},
		}));
	},
};
