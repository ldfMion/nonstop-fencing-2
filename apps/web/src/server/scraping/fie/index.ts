import assert from "assert";
import type * as Fie from "./types";
import { EventModel } from "~/models";
import { browserless } from "../browserless";
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
	return (dataPassed.items.concat(dataUpcoming.items) as Fie.Event[]).filter(
		event => {
			// console.log(event.name);
			// console.log(event.name.toLowerCase() == "tournoi satellite");
			return !["tournoi satellite", "tournoi satelite"].includes(
				event.name.toLowerCase()
			);
		}
	);
}

export function getFieEventUrl(
	fieCompetitionId: number,
	season: number
): string {
	return `https://fie.org/competitions/${season}/${fieCompetitionId}`;
}

export async function getEventData(event: Fie.Event) {
	const url = getFieEventUrl(event.competitionId, event.season);

	const browser = await browserless();
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

	const data = (await page.evaluate(
		// @ts-expect-error puppeteer window property
		() => window.__captureData.tableau
	)) as Fie.Tableau;

	await browser.close();
	return data;
}

export async function getLinkToLiveResults(event: EventModel): Promise<string> {
	const url = getFieEventUrl(event.fieCompetitionId, event.season);
	const browser = await browserless();
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	// TODO change waitForSelector to something else that actually finds the element, idk why this is working though
	const textSelector = await page.waitForSelector("text/Live Results");
	// @ts-expect-error puppeteer el.href property
	const liveResultsUrl: unknown = await textSelector!.evaluate(el => el.href);
	browser.close();
	assert(typeof liveResultsUrl == "string");
	return liveResultsUrl;
}
