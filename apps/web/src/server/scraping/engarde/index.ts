import { Browser } from "../browserless";

export async function getTableauData(tournamentUrl: string, browser: Browser) {
	const t64url = tournamentUrl + "/tableau64.htm";
	const page = await browser.newPage();
	await page.goto(t64url, { waitUntil: "domcontentloaded" });
	const fencerNodes = await page.$$eval("tr", els => {
		return els.map(el => el.innerText);
	});
	console.log("fencerNodes: ", fencerNodes);
}
