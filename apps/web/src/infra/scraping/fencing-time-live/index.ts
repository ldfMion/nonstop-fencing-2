import { scrapeTableauPage } from "./tableau";
import { resolveUrl } from "./resolveUrl";
import { EventModel } from "~/lib/models";
import assert from "assert";
import { Browser } from "../browserless";
import { updateEvent } from "~/services/bouts/queries";

export async function getTableauData(
	browser: Browser,
	event: EventModel,
	tournamentUrl?: string
) {
	// const url = "https://www.fencingtimelive.com/tableaus/scores/906625D1D3A8480EB245C3B059A3B06C/72F409219AAB44D4BF5259B79CAABACB/trees/6CD6DB2E13C84D1EBCD52027E402C8B0/tables/0/7";
	if (event.liveResultsTableauUrl) {
		return await scrapeTableauPage(event.liveResultsTableauUrl, browser);
	}
	assert(tournamentUrl, "Tournament URL is required");
	const tableauHtmlUrl = await resolveUrl(tournamentUrl!, event, browser);
	console.log("Event results ftl tableau url: ", tableauHtmlUrl);
	// const url = "https://www.fencingtimelive.com/tableaus/scores/3769F76EFA3E4370AED992957A6C6BCE/A8B41199D3F74E1A9A3C57E71FA43253/trees/5E31594493E94D1594DBB1E7660C9407/tables/0/7";
	const result = await scrapeTableauPage(tableauHtmlUrl, browser);
	// TODO REFACTOR this should be somewhere else
	updateEvent(event, {
		liveResultsTableauUrl: tableauHtmlUrl,
	});
	return result;
}
