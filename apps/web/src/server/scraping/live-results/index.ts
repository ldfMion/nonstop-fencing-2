import { getTableauData } from "../fencing-time-live";
import { getLinkToLiveResults, type Fie } from "../fie";

export async function getLiveResults(event: Fie.Event) {
	const url = await getLinkToLiveResults(event);
	// console.log("Live results url: ", url);
	if (url.includes("fencingtimelive")) {
		const ftlResults = await getTableauData(url, event);
		console.log("FTL Results:");
		console.log(ftlResults);
	}
}
