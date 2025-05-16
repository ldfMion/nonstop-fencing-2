import { QUERIES } from "../db/queries";
import { withBrowserless } from "./browserless";
import { getTableauData } from "./fencing-worldwide";

const event = await QUERIES.getEvent(59);
withBrowserless([
	async browser => {
		await getTableauData(
			event,
			"https://www.fencingworldwide.com/en/29843-2024/tournament/",
			browser
		);
	},
]);
