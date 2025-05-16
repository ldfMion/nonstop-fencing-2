import { NewFencerModel } from "~/models";
import { QUERIES } from "./db/queries";
import { getLiveResults } from "./scraping/live-results";
import {
	mapFTLBoutsToBoutModel,
	mapFTLFencerToFencerModel,
} from "./scraping/fencing-time-live/mappers";
import type * as LiveResults from "./scraping/fencing-time-live/types";
import { withBrowserless } from "./scraping/browserless";

export async function updateLiveEvents() {
	//TODO find events that are live today
	const eventId = 9;
	updateLiveEvent(eventId);
}

export async function updateLiveEvent(eventId: number) {
	const event = await QUERIES.getEvent(eventId);
	withBrowserless([
		async browser => {
			const results = await getLiveResults(event, browser);
			const newFencers: NewFencerModel[] = results[64].flatMap(bout => {
				const fencers: NewFencerModel[] = [];
				if (bout.fencer1) {
					fencers.push(
						mapFTLFencerToFencerModel(bout.fencer1, event.gender)
					);
				}
				if (bout.fencer2) {
					fencers.push(
						mapFTLFencerToFencerModel(bout.fencer2, event.gender)
					);
				}
				return fencers;
			});
			const countries = newFencers.map(f => ({ iocCode: f.country }));
			await QUERIES.insertCountries(countries);
			await QUERIES.insertFencers(newFencers);
			const uploadedFencers = await QUERIES.getFencers({
				firstName: newFencers.map(f => f.firstName),
				lastName: newFencers.map(f => f.lastName),
			});
			const bouts = Object.entries(results)
				.flatMap(([round, bouts]) =>
					mapFTLBoutsToBoutModel(
						bouts,
						round as unknown as LiveResults.Round,
						uploadedFencers,
						event
					)
				)
				.filter(b => b.fencerA || b.fencerB);
			await QUERIES.insertLiveBouts(bouts);

			console.log("updating lastLiveUpdate");
			QUERIES.updateEvent(event, {
				lastLiveUpdate: new Date(),
			});
		},
	]);
}
