import assert from "assert";
import { EventModel } from "~/models";
import { Browser } from "../browserless";

export async function resolveUrl(
	fieTournamentUrl: string,
	event: EventModel,
	browser: Browser
) {
	const eventResultsUrl = await getEventResultsUrl(
		fieTournamentUrl,
		event,
		browser
	);
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
	event: EventModel,
	browser: Browser
): Promise<string> {
	const page = await browser.newPage();
	await page.goto(tournamentUrl, { waitUntil: "domcontentloaded" });
	const eventTitle = `${
		event.gender == "MEN" ? "Men's" : "Women's"
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
	await page.goto(eventResultsUrl, { waitUntil: "networkidle0" });
	const eventResultsAfterRedirect = page.url();
	console.log("eventResultsAfterRedirect", eventResultsAfterRedirect);
	assert(typeof eventResultsAfterRedirect == "string");
	if (eventResultsAfterRedirect.includes("tableau")) {
		return eventResultsAfterRedirect;
	}
	const eventTableauUrl = await page.$$eval(
		"a.nav-link",
		els =>
			els
				.filter(el => el.innerHTML.toLowerCase().includes("tableau"))
				.at(-1)!.href
	);
	console.log("tabs", eventTableauUrl);
	assert(typeof eventTableauUrl == "string");
	return eventTableauUrl;
}

function parseEventWeapon(weapon: EventModel["weapon"]) {
	switch (weapon) {
		case "EPEE":
			return "Épée";
		case "FOIL":
			return "Foil";
		case "SABER":
			return "Saber";
		default:
			throw new Error(`Unexpected weapon in fie event data '${weapon}'`);
	}
}
