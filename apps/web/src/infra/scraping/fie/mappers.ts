import { toTitleCase } from "~/lib/utils";
import type { Fie } from ".";
import { createWeaponParser } from "../utils";
import {
	FencerModel,
	NewPastBoutModel,
	NewFencerModel,
	NewEventModel,
	EventModel,
} from "~/lib/models";
import assert from "assert";

export function mapFieEventsToDBCompetitions(events: Fie.Event[]) {
	const withName = events.map(event => ({
		...event,
		competitionName: createName(event),
	}));
	const filtered = withName.filter((event, index, self) => {
		const i =
			index ===
			self.findIndex(e => e.competitionName === event.competitionName);
		return i;
	});
	const competitions = filtered.map(event => ({
		name: event.competitionName,
		host: event.federation,
		season: event.season,
	}));
	return competitions;
}

export function mapFieEventToDBEvent(
	event: Fie.Event,
	competitionId: number
): NewEventModel {
	return {
		date: parseDate(event.endDate),
		weapon: parseFieWeapon(event.weapon),
		type: parseFieType(event.type),
		gender: parseFieGender(event.gender),
		hasFieResults: event.hasResults == 1,
		fieCompetitionId: event.competitionId,
		competition: competitionId,
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

export function createName(event: Fie.Event) {
	const eventType = parseFieEventTypeInName(event.name);
	if (
		eventType.toLowerCase().includes("world cup") ||
		eventType.toLowerCase().includes("grand prix")
	) {
		return toTitleCase(
			`${event.location} ${parseFieWeapon(
				event.weapon
			)} ${parseFieEventTypeInName(event.name)}`
		);
	}
	return toTitleCase(
		`${event.location} ${parseFieEventTypeInName(event.name)}`
	);
}

function parseFieEventTypeInName(name: string) {
	switch (name.trim().toLocaleLowerCase()) {
		case "coupe du monde":
		case "coupe du monde par équipes":
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

export function mapFieTableauToFencers(
	tableau: Fie.Tableau,
	event: EventModel
): NewFencerModel[] {
	return tableau[1]!.rounds["B64"]!.flatMap(bout => [
		mapFieFencerToModel(bout.fencer1, event.gender),
		mapFieFencerToModel(bout.fencer2, event.gender),
	]);
}

function mapFieFencerToModel(
	f: Fie.Fencer,
	gender: "MEN" | "WOMEN"
): NewFencerModel {
	const [firstName, lastName] = parseFieName(f.name);
	return {
		firstName: firstName,
		lastName: lastName,
		country: parseFieCountry(f.nationality),
		gender: gender,
	};
}

function parseFieCountry(nationality: string) {
	switch (nationality) {
		case "_AIN":
			return "AIN";
		case "TÜR":
			return "TUR";
		default:
			return nationality;
	}
}

function parseFieName(name: string): [string, string] {
	let firstName = "";
	let lastName = "";
	name.split(" ").forEach(word => {
		if (word == word.toUpperCase()) {
			lastName += ` ${word}`;
		} else {
			firstName += ` ${word}`;
		}
	});
	return [firstName.toLowerCase().trim(), lastName.toLowerCase().trim()];
}

export function mapFieTableauToBouts(
	tableau: Fie.Tableau,
	fencers: FencerModel[],
	event: EventModel
): NewPastBoutModel[] {
	return Object.entries(tableau[1]!.rounds).flatMap(([round, bouts]) =>
		bouts.map((bout, index) =>
			mapFieBoutToModel(
				bout,
				fencers,
				event.id,
				index,
				round.replace("B", "") as "2" | "4" | "8" | "16" | "32" | "64"
			)
		)
	);
}

function mapFieBoutToModel(
	b: Fie.Bout,
	fencers: FencerModel[],
	eventId: number,
	order: number,
	round: "2" | "4" | "8" | "16" | "32" | "64"
): NewPastBoutModel {
	const fencer1 = findFieFencer(b.fencer1, fencers);
	const fencer2 = findFieFencer(b.fencer2, fencers);
	return {
		round: round,
		order: order,
		fencerA: fencer1.id,
		fencerB: fencer2.id,
		fencerAScore: b.fencer1.score,
		fencerBScore: b.fencer2.score,
		event: eventId,
		winnerIsA: b.fencer1.isWinner,
	};
}

function findFieFencer(
	fencer: Fie.Fencer,
	fencers: FencerModel[]
): FencerModel {
	const [firstName, lastName] = parseFieName(fencer.name);
	const result = fencers.find(
		f =>
			f.firstName == firstName &&
			f.lastName == lastName &&
			f.country == parseFieCountry(fencer.nationality)
	);
	assert(result, `Unable to find fencer ${firstName} ${lastName}`);
	return result;
}
