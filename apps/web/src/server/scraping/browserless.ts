import puppeteer, { Browser } from "puppeteer-core";
import { env } from "~/../env";

export function browserless(): Promise<Browser> {
	console.log("Connecting to browserless");
	return puppeteer.connect({
		browserWSEndpoint: `wss://chrome.browserless.io?token=${env.BLESS_TOKEN}`,
	});
}
