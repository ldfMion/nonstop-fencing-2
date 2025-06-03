import { getIndividualRankings, getTeamRankings } from "~/infra/scraping/fie";
import { saveCountries } from "../countries";
import {
	getFencers,
	NewIndividualRankingDto,
	saveFencers,
	saveIndividualRankings,
	saveTeamRankings,
} from "./queries";
import {
	mapScrapedFencersToDbDto,
	mapScrapedIndividualRankingsToDbDto,
} from "./mappers";
import {
	ScrapedIndividualRankingDto,
	ScrapedTeamRankingDto,
} from "~/infra/scraping/dtos";

const RANKINGS: {
	gender: "MEN" | "WOMEN";
	weapon: "FOIL" | "EPEE" | "SABER";
}[] = [
	{ gender: "MEN", weapon: "FOIL" },
	{ gender: "MEN", weapon: "EPEE" },
	{ gender: "MEN", weapon: "SABER" },
	{ gender: "WOMEN", weapon: "FOIL" },
	{ gender: "WOMEN", weapon: "EPEE" },
	{ gender: "WOMEN", weapon: "SABER" },
];

const SEASON = 2025;

export async function updateRankings() {
	const individual = (
		await Promise.all(
			RANKINGS.map(weaponGender =>
				getIndividualRankings({
					season: SEASON,
					...weaponGender,
				})
			)
		)
	).flat();
	const team = (
		await Promise.all(
			RANKINGS.map(weaponGender =>
				getTeamRankings({
					season: SEASON,
					...weaponGender,
				})
			)
		)
	).flat();
	const countries = [
		...individual.map(f => ({ iocCode: f.fencer.country })),
		...team.map(t => ({ iocCode: t.team })),
	].filter(
		(country, index, self) =>
			self.findIndex(c => c.iocCode === country.iocCode) === index
	);
	await saveCountries(countries);
	await updateIndividualRankings(individual);
	await updateTeamRankings(team);
}

async function updateIndividualRankings(
	individual: ScrapedIndividualRankingDto
) {
	const fencers = mapScrapedFencersToDbDto(individual);
	await saveFencers(fencers);
	const uploadedFencers = await getFencers(fencers);
	const newRankings = mapScrapedIndividualRankingsToDbDto(
		individual,
		uploadedFencers
	);
	await saveIndividualRankings(newRankings);
}

async function updateTeamRankings(team: ScrapedTeamRankingDto) {
	saveTeamRankings(team);
}
