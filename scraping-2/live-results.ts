import { getFieEventUrl, type Fie } from "./fie";
import puppeteer from "puppeteer";
import assert from "assert";
import { getTableauData } from "./fencing-time-live";

async function getLinkToLiveResults(event: Fie.Event): Promise<string> {
	const url = getFieEventUrl(event);
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	const textSelector = await page.waitForSelector("text/Live Results");
	const liveResultsUrl: unknown = await textSelector!.evaluate(el => el.href);
	browser.close();
	assert(typeof liveResultsUrl == "string");
	return liveResultsUrl;
}

export async function getLiveResults(event: Fie.Event) {
	const url = await getLinkToLiveResults(event);
	console.log("Live results url: ", url);
	if (url.includes("fencingtimelive")) {
		const ftlResults = await getTableauData(url, event);
		console.log(ftlResults);
	}
}
