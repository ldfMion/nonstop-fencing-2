import { QUERIES } from "~/server/db/queries";
import { getEventData } from ".";
import { mapFieTableauToBouts, mapFieTableauToFencers } from "./mappers";

export async function testFieTableau() {
	const event = await QUERIES.getEvent(67);
	const t = await getEventData(event);
	console.log(t);
	const newFencers = mapFieTableauToFencers(t, event.gender);
	console.log(newFencers);
	await QUERIES.insertCountries(
		newFencers.map(f => ({
			iocCode: f.country,
		}))
	);
	await QUERIES.insertFencers(newFencers);
	const uploadedFencers = await QUERIES.getFencers({
		firstName: newFencers.map(f => f.firstName),
		lastName: newFencers.map(f => f.lastName),
	});
	const bouts = mapFieTableauToBouts(t, uploadedFencers, event.id);
	console.log(bouts);
	await QUERIES.insertPastBouts(bouts);
	QUERIES.updateEvent(event, {
		hasFieResults: true,
		hasResults: true,
	});
}
