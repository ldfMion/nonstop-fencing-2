import { browserless } from "../browserless";

export async function getTableauData(tournamentUrl: string) {
	const t64url = tournamentUrl + "/tableau64.htm";
	const browser = await browserless();
	const page = await browser.newPage();
	await page.goto(t64url, { waitUntil: "domcontentloaded" });
	const fencerNodes = await page.$$eval("tr", els => {
		return els.map(el => el.innerText);
	});
	browser.close();
	console.log("fencerNodes: ", fencerNodes);
}
