import {
	EventModel,
	FencerModel,
	NewFencerModel,
	NewPastBoutModel,
} from "~/lib/models";
import { saveCountries } from "../countries";
import {
	getFencers,
	insertFencers,
	insertPastBoutsAndUpdateEvent,
} from "./queries";

export async function savePastBouts<ScrapedTableau>(
	tableau: ScrapedTableau,
	event: EventModel,
	fencerMapper: (
		tableau: ScrapedTableau,
		event: EventModel
	) => NewFencerModel[],
	boutMapper: (
		tableau: ScrapedTableau,
		newFencers: FencerModel[],
		event: EventModel
	) => NewPastBoutModel[]
) {
	const newFencers = fencerMapper(tableau, event);
	const countries = newFencers.map(f => ({ iocCode: f.country }));
	await saveCountries(countries);
	await insertFencers(newFencers);
	const uploadedFencers = await getFencers({
		firstName: newFencers.map(f => f.firstName),
		lastName: newFencers.map(f => f.lastName),
	});
	try {
		const newBouts = boutMapper(tableau, uploadedFencers, event);
		await insertPastBoutsAndUpdateEvent(newBouts, event.id);
	} catch (e) {
		console.error(
			"There was an error mapping tableau to bouts with fencers: " + e
		);
		console.log(uploadedFencers);
		throw new Error(
			"There was an error mapping tableau to bouts with fencers: " + e
		);
	}
}
