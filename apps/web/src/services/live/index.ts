import { NewFencerModel } from "~/lib/models";
import { getLiveResults } from "../../infra/scraping/live-results";
import {
	mapFTLBoutsToBoutModel,
	mapFTLFencerToFencerModel,
} from "../../infra/scraping/fencing-time-live/mappers";
import type * as LiveResults from "../../infra/scraping/fencing-time-live/types";
import { withBrowserless } from "../../infra/scraping/browserless";
import {
	getFencers,
	insertFencers,
	insertLiveBouts,
	updateEvent,
} from "../bouts/queries";
import { getEvent } from "../queries";
import { saveCountries } from "../countries";

// TODO REFACTOR USE THE BOUTS SERVICE HERE

export async function updateLiveEvent(eventId: number) {
	const event = await getEvent(eventId);
	await withBrowserless([
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
			await saveCountries(countries);
			await insertFencers(newFencers);
			const uploadedFencers = await getFencers({
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
			await insertLiveBouts(bouts);

			console.log("updating lastLiveUpdate");
			updateEvent(event, {
				hasFieResults: true,
				hasResults: true,
			});
		},
	]);
}
