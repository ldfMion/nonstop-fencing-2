import assert from "assert";
import type * as Fie from "./types";
import { EventModel } from "~/lib/models";
import { Browser } from "../browserless";
import { validateTeamResults } from "./validation";
import { mapFieTeamEventResultsToDto } from "./mappers";
import { getIndividualRankings, getTeamRankings } from "./rankings";

export type { Fie };

const COMPETITIONS_ENDPOINT = "https://fie.org/competitions/search";
export async function fetchCompetitions(season: number) {
	const baseBody = {
		competitionCategory: "",
		fetchPage: 1,
		fromDate: "",
		gender: [],
		level: "s",
		name: "",
		season: season.toString(),
		// status: "passed",
		// status: "",
		toDate: "",
		type: [],
		weapon: [],
	};
	const bodyPassed = {
		...baseBody,
		status: "passed",
	};
	const bodyUpcoming = {
		...baseBody,
		status: "",
	};
	const responsePassed = await fetch(COMPETITIONS_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bodyPassed),
	});
	const responseUpcoming = await fetch(COMPETITIONS_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bodyUpcoming),
	});
	// console.log(response);
	// TODO validate with zod
	const dataPassed = (await responsePassed.json()) as any;
	const dataUpcoming = (await responseUpcoming.json()) as any;
	const filters = ["satellite", "satelite", "university"];
	return (dataPassed.items.concat(dataUpcoming.items) as Fie.Event[]).filter(
		event => !includesAny(event.name, filters)
	);
}

function includesAny(str: string, matches: string[]) {
	const lower = str.toLowerCase();
	for (const match of matches) {
		if (lower.includes(match)) {
			return true;
		}
	}
	return false;
}

export function getFieEventUrl(
	fieCompetitionId: number,
	season: number
): string {
	return `https://fie.org/competitions/${season}/${fieCompetitionId}`;
}

export async function getTeamEventData(
	event: { fieCompetitionId: number; season: number },
	browser: Browser
) {
	const data = await scrapeResultsFromFieWebsite(event, browser);
	const validated = validateTeamResults(data);
	return mapFieTeamEventResultsToDto(validated);
}

async function scrapeResultsFromFieWebsite(
	event: {
		fieCompetitionId: number;
		season: number;
	},
	browser: Browser
): Promise<unknown> {
	const url = getFieEventUrl(event.fieCompetitionId, event.season);
	console.log("url", url);

	const page = await browser.newPage();

	// Inject this before any page script executes
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(window, "__captureData", {
			value: {},
			// writable: false,
			configurable: false,
		});

		// Hook into variable assignment
		Object.defineProperty(window, "_tableau", {
			set: function (value) {
				if (value == undefined) {
					return;
				}
				// @ts-expect-error puppeteer window property
				window.__captureData.tableau = value;
			},
			get: function () {
				// @ts-expect-error puppeteer window property
				return window.__captureData.tableau;
			},
		});
	});

	await page.goto(url, {
		waitUntil: "domcontentloaded",
	});

	const data = await page.evaluate(() => {
		// @ts-expect-error puppeteer window property
		return window.__captureData.tableau;
	});
	return data;
}

export async function getIndividualEventData(
	event: { fieCompetitionId: number; season: number },
	browser: Browser
) {
	const data = (await scrapeResultsFromFieWebsite(
		event,
		browser
	)) as Fie.Tableau;
	console.log("data in getEventData", data);
	return data;
}

export async function getLinkToLiveResults(
	event: EventModel,
	browser: Browser
): Promise<string> {
	const url = getFieEventUrl(event.fieCompetitionId, event.season);
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	// TODO change waitForSelector to something else that actually finds the element, idk why this is working though
	const textSelector = await page.waitForSelector("text/Live Results");
	const liveResultsUrl: unknown = await textSelector!.evaluate(
		// @ts-expect-error puppeteer el.href property
		el => el.href
	);
	assert(typeof liveResultsUrl == "string");
	return liveResultsUrl;
}

export { getIndividualRankings, getTeamRankings };
