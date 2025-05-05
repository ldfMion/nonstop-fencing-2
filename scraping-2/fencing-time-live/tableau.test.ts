import path from "path";
import { scrapeTableauPage } from "./tableau";

const TEST_FILE_NAME = "test-files/incomplete-tableau.html";

function createLocalFilePupppeteerUrl(fileName: string) {
	const filePath = path.resolve(__dirname, fileName);
	return `file://${filePath}`;
}

const url = createLocalFilePupppeteerUrl(TEST_FILE_NAME);
const data = await scrapeTableauPage(url);
console.log(data);
data[64].forEach(console.log);
