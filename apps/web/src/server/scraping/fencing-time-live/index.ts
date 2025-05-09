import { scrapeTableauPage } from "./tableau";
import { resolveUrl } from "./resolveUrl";
import { EventModel } from "~/models";

export async function getTableauData(tournamentUrl: string, event: EventModel) {
	// const url = "https://www.fencingtimelive.com/tableaus/scores/906625D1D3A8480EB245C3B059A3B06C/72F409219AAB44D4BF5259B79CAABACB/trees/6CD6DB2E13C84D1EBCD52027E402C8B0/tables/0/7";
	const tableauHtmlUrl = await resolveUrl(tournamentUrl, event);
	console.log("Event results ftl tableau url: ", tableauHtmlUrl);
	// const url = "https://www.fencingtimelive.com/tableaus/scores/3769F76EFA3E4370AED992957A6C6BCE/A8B41199D3F74E1A9A3C57E71FA43253/trees/5E31594493E94D1594DBB1E7660C9407/tables/0/7";
	return scrapeTableauPage(tableauHtmlUrl);
}
