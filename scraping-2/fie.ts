import puppeteer from "puppeteer";

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
	return data.items as Fie.Event[];
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

export namespace Fie {
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
