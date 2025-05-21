import { EventModel } from "~/lib/models";
import { Browser } from "../browserless";

export async function getTableauData(
	event: EventModel,
	tournamentUrl: string,
	browser: Browser
) {
	const page = await browser.newPage();
	const eventTitle = `${event.gender == "MEN" ? "Men's" : "Women's"} Individual`;
	console.log("Event title: ", eventTitle);
	await page.goto(tournamentUrl, { waitUntil: "domcontentloaded" });
	const eventResultsUrl = await page.evaluate(text => {
		// Find elements that contain the text
		const elements = Array.from(document.querySelectorAll("li>a"));
		const targetElement = elements.find(element =>
			// @ts-expect-error puppeteer element.innerText property
			element.innerText.includes(text)
		);
		// @ts-expect-error puppeteer .href property
		return targetElement.href;
	}, eventTitle);
	console.log("eventResultsUrl", eventResultsUrl);
	const tableauUrl = eventResultsUrl.replace("global", "direct/2");
	console.log("tableauUrl", tableauUrl);
	await page.goto(tableauUrl, { waitUntil: "domcontentloaded" });
	const fencerNodes = await page.$$eval("div.col-lg-4.col-sm-6.p-1", els => {
		const r64 = els.filter(el => el.innerText.includes("Table of 64"))[0]!;
		return Array.from(r64.querySelectorAll("div.border.border-2.p-0")).map(
			el => el.textContent
		);
	});
	console.log("fencerNodes: ", fencerNodes);
	console.log("fencerNodes length: ", fencerNodes.length);
}
