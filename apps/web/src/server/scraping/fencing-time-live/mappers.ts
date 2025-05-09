import {
	EventModel,
	FencerModel,
	NewBoutModel,
	NewFencerModel,
} from "~/models";
import type * as LiveResults from "./types";

export function mapFTLFencerToFencerModel(
	f: LiveResults.Fencer,
	gender: "MEN" | "WOMEN"
): NewFencerModel {
	return {
		firstName: formatName(f.firstName),
		lastName: formatName(f.lastName),
		country: f.countryCode,
		gender,
	};
}

export function mapFTLBoutsToBoutModel(
	bouts: LiveResults.Bout[],
	round: LiveResults.Round,
	fencers: FencerModel[],
	event: EventModel
): NewBoutModel[] {
	return bouts.map((bout, index) => {
		let fencerA = undefined;
		if (bout.fencer1) {
			const firstNameA = bout.fencer1.firstName;
			const lastNameA = bout.fencer1.lastName;
			fencerA = fencers.find(
				f =>
					f.firstName == formatName(firstNameA) &&
					formatName(lastNameA)
			)!.id;
		}
		let fencerB = undefined;
		if (bout.fencer2) {
			const firstNameB = bout.fencer2.firstName;
			const lastNameB = bout.fencer2.lastName;
			fencerB = fencers.find(
				f =>
					f.firstName == formatName(firstNameB) &&
					f.lastName == formatName(lastNameB)
			)!.id;
		}
		return {
			round: round.toString() as "2" | "4" | "8" | "16" | "32" | "64",
			order: index,
			fencerA: fencerA,
			fencerB: fencerB,
			fencerAScore: bout.fencer1?.score,
			fencerBScore: bout.fencer2?.score,
			event: event.id,
			winnerIsA: bout.fencer1?.winner,
		};
	});
}

function formatName(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
