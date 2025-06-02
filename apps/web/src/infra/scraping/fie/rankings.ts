import axios from "axios";
import { z } from "zod";

const RANKINGS_ENDPOINT = "https://fie.org/athletes";

export async function getIndividualRankings(options: Omit<Options, "type">) {
	const body = getRankingsRequestBody({ ...options, type: "INDIVIDUAL" });
	const data = await fetchRankings(body);
	console.log(data);
}

export async function getTeamRankings(options: Omit<Options, "type">) {
	const body = getRankingsRequestBody({ ...options, type: "TEAM" });
	const data = await fetchRankings(body);
	console.log(data);
}

async function fetchRankings(body: unknown) {
	try {
		const res = await axios.post(RANKINGS_ENDPOINT, body);
		return responseSchema.parse(res.data).allAthletes;
	} catch (error) {
		throw new Error(`Error accessing athletes endpoint: ${error}`);
	}
}

type Options = {
	season: number;
	gender: "MEN" | "WOMEN";
	weapon: "FOIL" | "EPEE" | "SABER";
	type: "INDIVIDUAL" | "TEAM";
};

function getRankingsRequestBody({ season, gender, weapon, type }: Options) {
	return {
		weapon: parseWeapon(weapon),
		level: "s",
		type: parseType(type),
		gender: parseGender(gender),
		isSearch: false,
		season: parseSeason(season),
		fetchPage: 1,
	};
}

// ? i guess I should have used objects/maps instead of functions

function parseWeapon(weapon: Options["weapon"]) {
	switch (weapon) {
		case "FOIL":
			return "f";
		case "EPEE":
			return "e";
		case "SABER":
			return "s";
		default:
			throw new Error(`Unexpected weapon in fie event data '${weapon}'`);
	}
}

function parseType(type: Options["type"]) {
	switch (type) {
		case "INDIVIDUAL":
			return "i";
		case "TEAM":
			// i don't know why it is e
			return "e";
		default:
			throw new Error(`Unexpected type in fie event data '${type}'`);
	}
}

function parseGender(gender: Options["gender"]) {
	switch (gender) {
		case "MEN":
			return "m";
		case "WOMEN":
			return "f";
		default:
			throw new Error(`Unexpected gender in fie event data '${gender}'`);
	}
}

function parseSeason(season: Options["season"]) {
	return season.toString();
}

const responseSchema = z.object({
	allAthletes: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			country: z.string(),
			// weapon: z.enum(['E', 'F', 'S']),
			// gender: z.enum(['M', 'F']),
			points: z.coerce.number(),
			hand: z.nullable(z.string()),
			height: z.nullable(z.string()),
			rank: z.coerce.number(),
			flag: z.string(),
			image: z.string(),
			addrId: z.string(),
		})
	),
});
