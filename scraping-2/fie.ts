import puppeteer from "puppeteer";
import assert from "assert";

console.log("Hello, world!");

const COMPETITIONS_ENDPOINT = "https://fie.org/competitions/search";
async function fetchCompetitions() {
	const body = {
		competitionCategory: "",
		fetchPage: 1,
		fromDate: "",
		gender: [],
		level: "s",
		name: "",
		season: "2025",
		status: "passed",
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
	console.log(response);
	const data = (await response.json()) as any;
	return data.items as Fie.Event[];
}

async function getEventData(event: Fie.Event) {
	const url = `https://fie.org/competitions/${event.season}/${event.competitionId}`;

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
				window.__captureData.tableau = value;
			},
			get: function () {
				return window.__captureData.tableau;
			},
		});
	});

	await page.goto(url, {
		waitUntil: "domcontentloaded",
	});

	const data = (await page.evaluate(
		() => window.__captureData.tableau
	)) as Fie.Tableau;

	await browser.close();
	return data;
}

namespace Fie {
	export type Tableau = {
		rounds: Rounds;
	}[];

	type Rounds = Record<RoundId, Bout[]>;

	type RoundId = string;
	type Bout = {
		fencer1: Fencer;
		fencer2: Fencer;
	};
	type Fencer = {
		name: string;
		id: number;
		nationality: string;
		isWinner: boolean;
		score: number;
	};
	export type Event = {
		season: number;
		competitionId: number;
		name: string;
		location: string;
		country: string;
		federation: string;
		flag: string;
		startDate: string;
		endDate: string;
		weapon: Weapon;
		weapons: Weapon[];
		gender: string;
		category: Category;
		categories: Category[];
		type: string;
		hasResults: number;
		isSubCompetition: boolean;
		isLink: boolean;
	};
	type Weapon = string;
	type Category = string;
}

const events = await fetchCompetitions();
console.log(events);
console.log(events[0]);
const eventData = await getEventData(events[0]);
assert(eventData[1] != undefined, "No data found");
console.log(eventData[1].rounds);
