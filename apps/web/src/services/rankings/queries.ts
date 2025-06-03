import { sql, and, eq, or } from "drizzle-orm";
import { db } from "~/infra/db";
import {
	fencers,
	individualSeasonRankings,
	teamSeasonRankings,
} from "~/infra/db/schema";

export type NewFencerDto = typeof fencers.$inferInsert;
export type NewIndividualRankingDto =
	typeof individualSeasonRankings.$inferInsert;
export type NewTeamRankingDto = typeof teamSeasonRankings.$inferInsert;

export async function saveFencers(newFencers: NewFencerDto[]) {
	const results = await db
		.insert(fencers)
		.values(newFencers)
		.onConflictDoUpdate({
			target: [fencers.firstName, fencers.lastName, fencers.country],
			set: {
				firstName: sql`EXCLUDED.first_name`,
				lastName: sql`EXCLUDED.last_name`,
				country: sql`EXCLUDED.country`,
			},
		})
		.returning({
			firstName: fencers.firstName,
			lastName: fencers.lastName,
			country: fencers.country,
		});
	console.log("Uploaded fencers were: ", results);
}

export async function getFencers(
	filters: {
		firstName: string;
		lastName: string;
		country: string;
		gender: "MEN" | "WOMEN";
	}[]
) {
	const queryFilters = filters.map(f =>
		and(
			eq(fencers.firstName, f.firstName),
			eq(fencers.lastName, f.lastName),
			eq(fencers.country, f.country),
			eq(fencers.gender, f.gender)
		)
	);
	return db
		.select()
		.from(fencers)
		.where(or(...queryFilters));
}

export async function saveIndividualRankings(
	newRankings: NewIndividualRankingDto[]
) {
	console.log("saving individual rankings");
	console.log(
		await db
			.insert(individualSeasonRankings)
			.values(newRankings)
			.onConflictDoUpdate({
				target: [
					individualSeasonRankings.fencer,
					individualSeasonRankings.gender,
					individualSeasonRankings.season,
					individualSeasonRankings.weapon,
				],
				set: {
					position: sql`EXCLUDED.position`,
				},
			})
	);
}

export async function saveTeamRankings(newRankings: NewTeamRankingDto[]) {
	console.log("saving team rankings");
	console.log(
		await db
			.insert(teamSeasonRankings)
			.values(newRankings)
			.onConflictDoUpdate({
				target: [
					teamSeasonRankings.team,
					teamSeasonRankings.gender,
					teamSeasonRankings.season,
					teamSeasonRankings.weapon,
				],
				set: {
					team: sql`EXCLUDED.position`,
				},
			})
	);
}
