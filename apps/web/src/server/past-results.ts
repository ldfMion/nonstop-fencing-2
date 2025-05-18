import { QUERIES } from "./db/queries";
import { scrapePastEvent } from "./scraping/past-events";

export async function updatePastResults(): Promise<void> {
	const events = await QUERIES.getEventsWithMissingResults();
	if (events.length == 0) {
		console.log("No missing events.");
		return;
	}
	console.log(
		`Added ${events.length} to queue: ${events.map(e => e.id).join(", ")}.`
	);
	events.map(event => scrapePastEvent(event.id));
	console.log(
		`Updated ${events.length} events: ${events.map(e => e.id).join(", ")}.`
	);
}
