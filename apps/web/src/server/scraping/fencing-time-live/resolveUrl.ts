import puppeteer from "puppeteer";
import type { Fie } from "../fie";
import assert from "assert";

export async function resolveUrl(fieTournamentUrl: string, event: Fie.Event) {
	const eventResultsUrl = await getEventResultsUrl(fieTournamentUrl, event);
	const tableauHtmlUrl = await getTableauHtmlUrl(eventResultsUrl);
	return tableauHtmlUrl;
}

async function getTableauHtmlUrl(eventResultsUrl: string): Promise<string> {
	// i don't know what these ids are
	const split = eventResultsUrl.split("/");
	const lastId = split[split.length - 1];
	const secondToLastId = split[split.length - 2];
	const treeIdRequestUrl = `https://www.fencingtimelive.com/tableaus/scores/${secondToLastId}/${lastId}/trees`;
	const response = await fetch(treeIdRequestUrl);
	const json = (await response.json()) as [{ guid: string }];
	// TODO add zod validation to this json
	const additionalId = json[0].guid;
	assert(typeof additionalId == "string");
	return `https://www.fencingtimelive.com/tableaus/scores/${secondToLastId}/${lastId}/trees/${additionalId}/tables/0/7`;
}

async function getEventResultsUrl(
	tournamentUrl: string,
	event: Fie.Event
): Promise<string> {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(tournamentUrl, { waitUntil: "domcontentloaded" });
	const eventTitle = `${
		event.gender == "men" ? "Men's" : "Women's"
	} ${parseEventWeapon(event.weapon)} (Day 2)`;
	console.log("Event title: ", eventTitle);
	const eventResultsUrl = await page.evaluate(text => {
		// Find elements that contain the text
		const elements = Array.from(document.querySelectorAll("td>a"));
		const targetElement = elements.find(element =>
			// @ts-expect-error puppeteer element.innerText property
			element.innerText.includes(text)
		);
		// @ts-expect-error puppeteer .href property
		return targetElement.href;
	}, eventTitle);
	console.log("eventResultsUrl", eventResultsUrl);
	await page.goto(eventResultsUrl, { waitUntil: "domcontentloaded" });
	const eventResultsAfterRedirect = page.url();
	console.log("eventResultsAfterRedirect", eventResultsAfterRedirect);
	browser.close();
	assert(typeof eventResultsAfterRedirect == "string");
	return eventResultsAfterRedirect;
}

function parseEventWeapon(weapon: string) {
	switch (weapon) {
		case "epee":
			return "Épée";
		case "foil":
			return "Foil";
		case "sabre":
			return "Saber";
		default:
			throw new Error(`Unexpected weapon in fie event data '${weapon}'`);
	}
}
