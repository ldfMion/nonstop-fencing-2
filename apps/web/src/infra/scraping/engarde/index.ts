import { Browser } from "../browserless";
import { parseFencerNodes } from "./parser";
import { scrapeData } from "./scraping";

export async function getTableauData(tournamentUrl: string, browser: Browser) {
	const [fencerNodesTo16, fencerNodesToFinal] = await scrapeData(
		tournamentUrl,
		browser
	);
	const data = parseFencerNodes(fencerNodesTo16, fencerNodesToFinal);
}
