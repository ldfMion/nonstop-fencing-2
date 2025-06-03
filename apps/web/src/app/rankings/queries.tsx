import { db } from "~/infra/db";
import { and, eq, desc } from "drizzle-orm";
import {
	countries,
	fencers,
	individualSeasonRankings,
} from "~/infra/db/schema";

export async function getRankingsForWeaponAndGender(
	weapon: "FOIL" | "EPEE" | "SABER",
	gender: "MEN" | "WOMEN",
	season: number
) {
	return db
		.select({
			fencer: {
				firstName: fencers.firstName,
				lastName: fencers.lastName,
				flag: countries.isoCode,
			},
			points: individualSeasonRankings.points,
			position: individualSeasonRankings.position,
		})
		.from(individualSeasonRankings)
		.where(
			and(
				eq(individualSeasonRankings.weapon, weapon),
				eq(individualSeasonRankings.gender, gender),
				eq(individualSeasonRankings.season, season)
			)
		)
		.innerJoin(fencers, eq(individualSeasonRankings.fencer, fencers.id))
		.innerJoin(countries, eq(fencers.country, countries.iocCode))
		.orderBy(desc(individualSeasonRankings.points));
}
