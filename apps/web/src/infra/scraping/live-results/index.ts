import { EventModel } from "~/lib/models";
import { getTableauData } from "../fencing-time-live";
import { getLinkToLiveResults } from "../fie";
import { Tableau } from "../fencing-time-live/types";
import { Browser } from "../browserless";

export async function getLiveResults(
	event: EventModel,
	browser: Browser
): Promise<Tableau> {
	if (event.liveResultsTableauUrl) {
		return await switchResultsProvider(
			event.liveResultsTableauUrl,
			async () => await getTableauData(browser, event)
		);
	}
	const liveResultsUrlOnFieWebsite = await getLinkToLiveResults(
		event,
		browser
	);
	return await switchResultsProvider(
		liveResultsUrlOnFieWebsite,
		async () =>
			await getTableauData(browser, event, liveResultsUrlOnFieWebsite)
	);
	// console.log("Live results url: ", url);
}

function switchResultsProvider(
	url: string,
	ftl: () => Promise<Tableau>
): Promise<Tableau> {
	try {
		if (url.includes("fencingtimelive")) {
			return ftl();
		}
	} catch (e) {
		throw new Error(
			"Error getting tableau data from Fencing Time Live. Error: " + e
		);
	}
	throw new Error(
		"there was something wrong with the FIE live results link: " + url
	);
}
