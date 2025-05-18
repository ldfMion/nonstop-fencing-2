import { QUERIES } from "../db/queries";
import { Browser, withBrowserless } from "./browserless";
import { getEventData } from "./fie";
import { mapFieTableauToBouts, mapFieTableauToFencers } from "./fie/mappers";

export async function scrapePastEvent(eventId: number): Promise<void> {
	const event = await QUERIES.getEvent(eventId);
	console.log("Event: ", event);
	await withBrowserless([
		async browser => {
			const t = await getEventData(event, browser);
			const newFencers = mapFieTableauToFencers(t, event.gender);
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
			// this try/catch is here to print the fencers only in case of error
			try {
				const bouts = mapFieTableauToBouts(
					t,
					uploadedFencers,
					event.id
				);
				await QUERIES.insertPastBouts(bouts);
				QUERIES.updateEvent(event, {
					hasFieResults: true,
					hasResults: true,
				});
				console.log("Finished scraping event ", event.id);
			} catch (e) {
				console.error(
					"There was an error mapping tableau to bouts with fencers: " +
						e
				);
				console.log(uploadedFencers);
				throw new Error(
					"There was an error mapping tableau to bouts with fencers: " +
						e
				);
			}
		},
	]);
}
