import { db } from "~/infra/db";
import { and, eq, asc } from "drizzle-orm";
import {
	countries,
	fencers,
	individualSeasonRankings,
	teamSeasonRankings,
} from "~/infra/db/schema";

export async function getIndividualRankingsForWeaponAndGender(
	weapon: "FOIL" | "EPEE" | "SABER",
	gender: "MEN" | "WOMEN",
	season: number,
	limit: number
) {
	const rows = await db
		.select({
			fencer: {
				firstName: fencers.firstName,
				lastName: fencers.lastName,
				id: fencers.id,
			},
			flag: countries.isoCode,
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
		.orderBy(asc(individualSeasonRankings.position))
		.limit(limit);
	return rows.map(r => ({ ...r, flag: r.flag ?? undefined }));
}

export async function getTeamRankings(
	weapon: "FOIL" | "EPEE" | "SABER",
	gender: "MEN" | "WOMEN",
	season: number,
	limit: number
) {
	return (
		await db
			.select({
				team: { name: countries.name, id: countries.iocCode },
				flag: countries.isoCode,
				points: teamSeasonRankings.points,
				position: teamSeasonRankings.position,
			})
			.from(teamSeasonRankings)
			.where(
				and(
					eq(teamSeasonRankings.weapon, weapon),
					eq(teamSeasonRankings.gender, gender),
					eq(teamSeasonRankings.season, season)
				)
			)
			.innerJoin(
				countries,
				eq(teamSeasonRankings.team, countries.iocCode)
			)
			.orderBy(asc(teamSeasonRankings.position))
			.limit(limit)
	).map(r => ({
		...r,
		flag: r.flag ?? undefined,
		team: { name: r.team.name!, id: r.team.id! },
	}));
}

const categories = {
	weapon: ["FOIL", "EPEE", "SABER"],
	gender: ["MEN", "WOMEN"],
};

export async function getRankingsOverview(season: 2025) {
	return {
		mensFoilIndividual: await getIndividualRankingsForWeaponAndGender(
			"FOIL",
			"MEN",
			season,
			3
		),
		mensEpeeIndividual: await getIndividualRankingsForWeaponAndGender(
			"EPEE",
			"MEN",
			season,
			3
		),
		mensSaberIndividual: await getIndividualRankingsForWeaponAndGender(
			"SABER",
			"MEN",
			season,
			3
		),
		womensFoilIndividual: await getIndividualRankingsForWeaponAndGender(
			"FOIL",
			"WOMEN",
			season,
			3
		),
		womensEpeeIndividual: await getIndividualRankingsForWeaponAndGender(
			"EPEE",
			"WOMEN",
			season,
			3
		),
		womensSaberIndividual: await getIndividualRankingsForWeaponAndGender(
			"SABER",
			"WOMEN",
			season,
			3
		),
		mensFoilTeam: await getTeamRankings("FOIL", "MEN", season, 3),
		mensEpeeTeam: await getTeamRankings("EPEE", "MEN", season, 3),
		mensSaberTeam: await getTeamRankings("SABER", "MEN", season, 3),
		womensFoilTeam: await getTeamRankings("FOIL", "WOMEN", season, 3),
		womensEpeeTeam: await getTeamRankings("EPEE", "WOMEN", season, 3),
		womensSaberTeam: await getTeamRankings("SABER", "WOMEN", season, 3),
	};
}
