import path from "path";
import { scrapeTableauPage } from "./tableau";
import { fileURLToPath } from "url";
import { withBrowserless } from "../browserless";

const TEST_FILE_NAME = "test-files/incomplete-tableau.test.html";

function createLocalFilePupppeteerUrl(fileName: string) {
	const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
	const __dirname = path.dirname(__filename);
	const filePath = path.resolve(__dirname, fileName);
	console.log("filePath", filePath);
	return `file://${filePath}`;
}

withBrowserless([
	async browser => {
		const url = createLocalFilePupppeteerUrl(TEST_FILE_NAME);
		const data = await scrapeTableauPage(url, browser);
		console.log("data", data);
	},
]);
