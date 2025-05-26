import { getTableauData } from ".";
import { withBrowserless } from "../browserless";

export function testEngarde() {
	// const url = "https://engarde-service.com/tournament/arcasso/stmaur2025";
	const url = "https://engarde-service.com/competition/ffe/fmcip2025/fhin";
	withBrowserless([
		async browser => {
			const result = await getTableauData(url, browser);
			// console.log(result);
		},
	]);
}
