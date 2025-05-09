import { EventModel } from "~/models";
import { getTableauData } from "../fencing-time-live";
import { getLinkToLiveResults } from "../fie";

export async function getLiveResults(event: EventModel) {
	const url = await getLinkToLiveResults(event);
	// console.log("Live results url: ", url);
	if (url.includes("fencingtimelive")) {
		const ftlResults = await getTableauData(url, event);
		return ftlResults;
	}
	throw new Error("there was something wrong with the url: " + url);
}
