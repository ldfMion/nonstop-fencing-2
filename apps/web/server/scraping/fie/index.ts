import puppeteer from "puppeteer";
import assert from "assert";
import type * as Fie from "./types";
export type { Fie };

const COMPETITIONS_ENDPOINT = "https://fie.org/competitions/search";
export async function fetchCompetitions() {
	const body = {
		competitionCategory: "",
		fetchPage: 1,
		fromDate: "",
		gender: [],
		level: "s",
		name: "",
		season: "2025",
		status: "passed",
		// status: "",
		toDate: "",
		type: [],
		weapon: [],
	};
	const response = await fetch(COMPETITIONS_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	// console.log(response);
	const data = (await response.json()) as any;
	return (data.items as Fie.Event[]).filter(event => {
		// console.log(event.name);
		// console.log(event.name.toLowerCase() == "tournoi satellite");
		return !["tournoi satellite", "tournoi satelite"].includes(
			event.name.toLowerCase()
		);
	});
}

export function getFieEventUrl(event: Fie.Event): string {
	return `https://fie.org/competitions/${event.season}/${event.competitionId}`;
}

export async function getEventData(event: Fie.Event) {
	const url = getFieEventUrl(event);

	const browser = await puppeteer.launch();
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

export async function getLinkToLiveResults(event: Fie.Event): Promise<string> {
	const url = getFieEventUrl(event);
	const browser = await puppeteer.launch();
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
