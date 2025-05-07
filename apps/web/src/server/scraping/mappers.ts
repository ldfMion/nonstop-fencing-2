import type { Fie } from "./fie";
import type { DBEventInput } from "../db/queries";
import { createWeaponParser } from "./utils";

export function mapFieEventToDBEvent(event: Fie.Event): DBEventInput {
	return {
		date: parseDate(event.startDate),
		name: `${event.location} ${parseFieName(event.name)}`,
		countryCode: event.federation,
		weapon: parseFieWeapon(event.weapon),
		type: parseFieType(event.type),
		gender: parseFieGender(event.gender),
		season: event.season,
		hasFieResults: event.hasResults == 1,
		fieCompetitionId: event.competitionId,
	};
}

const parseFieWeapon = createWeaponParser({
	saber: ["sabre", "SABER"],
	epee: ["epee", "EPEE"],
	foil: ["foil", "FOIL"],
});

function parseFieType(type: string) {
	if (type == "individual") {
		return "INDIVIDUAL";
	}
	if (type == "team") {
		return "TEAM";
	}
	throw new Error(`Unrecognized Fie event type ${type}`);
}

function parseDate(str: string) {
	const [day, month, year] = str.split("-");
	if (!day || !month || !year) {
		throw new Error(`Failed to parse date: '${str}'`);
	}
	const date = new Date(Number(year), Number(month) - 1, Number(day)); // month is 0-indexed in JS Date
	if (isNaN(date.getTime())) {
		throw new Error(`Failed to parse date: '${str}'`);
	}
	return date;
}

function parseFieName(name: string) {
	switch (name) {
		case "Coupe du Monde":
		case "Coupe du Monde par équipes":
			return "World Cup";
		default:
			return name;
	}
}

function parseFieGender(gender: string) {
	if (gender == "men") {
		return "MEN";
	}
	if (gender == "women") {
		return "WOMEN";
	}
	throw new Error(`Unexpected gender '${gender}'`);
}
