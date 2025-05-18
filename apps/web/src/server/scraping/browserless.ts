import puppeteer, { Browser, Page } from "puppeteer-core";
import { env } from "~/../env";

export { Browser, Page };

export async function withBrowserless(
	scripts: ((browser: Browser) => Promise<void>)[]
) {
	console.log("Connecting to browserless");
	let browser: Browser | null = null;

	try {
		browser = await puppeteer.connect({
			browserWSEndpoint: `wss://chrome.browserless.io?token=${env.BLESS_TOKEN}`,
		});
	} catch (connectionError) {
		close(browser, "error in connection");
		throw new Error("Browserless connection failed: " + connectionError);
	}
	try {
		await Promise.all(
			scripts.map(async script => {
				await script(browser);
			})
		);
		close(browser, "finished scripts");
	} catch (scriptError) {
		close(browser, "error in script" + scriptError);
		throw new Error("Script execution failed: " + scriptError);
	}
}

async function close(browser: Browser | null, message: string) {
	if (browser) {
		console.log("closing browser for " + message);
		try {
			console.log("Closing browser...");
			await browser.close();
		} catch (closeError) {
			console.error("Error while closing browser:", closeError);
		}
	}
}
