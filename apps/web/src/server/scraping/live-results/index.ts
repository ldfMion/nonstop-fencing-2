import { EventModel } from "~/models";
import { getTableauData } from "../fencing-time-live";
import { getLinkToLiveResults } from "../fie";
import { Tableau } from "../fencing-time-live/types";

export async function getLiveResults(event: EventModel): Promise<Tableau> {
	if (event.liveResultsTableauUrl) {
		return switchResultsProvider(event.liveResultsTableauUrl, () =>
			getTableauData(event)
		);
	}
	const liveResultsUrlOnFieWebsite = await getLinkToLiveResults(event);
	return switchResultsProvider(liveResultsUrlOnFieWebsite, () =>
		getTableauData(event, liveResultsUrlOnFieWebsite)
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
