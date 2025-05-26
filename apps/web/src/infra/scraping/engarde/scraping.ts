import { Browser, Page } from "../browserless";

const BASE_URL = "https://engarde-service.com";

export async function scrapeData(urlFromFie: string, browser: Browser) {
	const page = await browser.newPage();
	await resolveTournamentUrl(urlFromFie, page);
	const t64url = await resolveT64Url(page);
	const t16url = await resolveT16Url(page);
	return [
		await scrapeTableauPage(t64url, browser),
		await scrapeTableauPage(t16url, browser),
	];
}

async function resolveTournamentUrl(urlFromFie: string, page: Page) {
	await page.goto(urlFromFie, { waitUntil: "domcontentloaded" });
	const isInEventPage = await checkIfThisIsTheEventPage(page);
	if (isInEventPage) {
		return;
	}
	const engardeTournamentUrl = await getLinkToEventPage(page);
	await page.goto(engardeTournamentUrl, { waitUntil: "domcontentloaded" });
}

async function checkIfThisIsTheEventPage(page: Page) {
	const isInEventPage = await page.evaluate(text => {
		return document.body.innerText.includes(text);
	}, "Tableau principal de 64");
	// console.log("is in event page", isInEventPage);
	return isInEventPage;
}

async function getLinkToEventPage(page: Page) {
	const url = await page.$$eval(".linkCompe", els => {
		//@ts-expect-error
		return els[0].innerText;
	});
	const engardeTournamentUrl = BASE_URL + url;
	return engardeTournamentUrl;
}

async function resolveT64Url(page: Page) {
	const t64url = await page.$$eval("a", els => {
		return els.filter(el =>
			el.innerText.includes("Tableau principal de 64")
		)[0].href;
	});
	return t64url;
}

async function resolveT16Url(page: Page) {
	const t16url = await page.$$eval("a", els => {
		return els.filter(el =>
			el.innerText.includes("Tableau principal de 16")
		)[0].href;
	});
	return t16url;
}

export async function scrapeTableauPage(url: string, browser: Browser) {
	console.log("url", url);
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	const fencerNodes = await extractFencers(page);
	// console.log("fencerNodes: ", fencerNodes);
	return fencerNodes;
}

function extractFencers(page: Page) {
	return page.$$eval("tr", els => {
		return els.map(el => ({
			//@ts-expect-error
			fencerText: el.querySelector(".fencer")?.innerText,
			//@ts-expect-error
			countryText: el.querySelector(".country-container")?.innerText,
			//@ts-expect-error
			scoreText: el.querySelector(".score")?.innerText,
		}));
		// .filter(el => JSON.stringify(el) != "{}");
	});
}
