// import "server-only";
// import { competitions, countries, events } from "./schema";
import { events } from "./schema";
import { db } from ".";
import { Competition } from "~/app/events/events-list";

export type DBEventInput = typeof events.$inferInsert;

export const QUERIES = {
	async getCompetitions(
		filters: {
			season: number;
			gender?: "MEN" | "WOMEN";
			weapon?: "FOIL" | "EPEE" | "SABER";
			type?: "INDIVIDUAL" | "TEAM";
			upcoming: boolean;
		} = { season: 2025, upcoming: false }
	): Promise<Competition[]> {
		const cs = await db.query.competitions.findMany({
			where: (c, { eq, and, exists }) =>
				and(
					eq(c.season, filters.season),
					exists(
						db
							.select({})
							.from(events)
							.where(
								and(
									eq(events.competition, c.id),
									filters.gender
										? eq(events.gender, filters.gender)
										: undefined,
									filters.weapon
										? eq(events.weapon, filters.weapon)
										: undefined,
									filters.type
										? eq(events.type, filters.type)
										: undefined
								)
							)
					)
				),
			with: {
				events: {
					orderBy: (events, { asc }) => [asc(events.date)],
				},
				host: true,
			},
		});
		return cs
			.map(c => {
				// console.log(c);
				return {
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
				};
			})
			.filter(c => {
				const past = c.date.end.getTime() - new Date().getTime() < 0;
				return filters.upcoming ? !past : past;
			});
	},
};
