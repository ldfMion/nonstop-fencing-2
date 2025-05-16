import axios from "axios";
import { QUERIES } from "~/server/db/queries";
import { withBrowserless } from "~/server/scraping/browserless";
import { scrapePastEvent } from "~/server/scraping/past-events";

export async function POST() {
	const events = await QUERIES.getEventsWithFieResults();
	if (events.length == 0) {
		console.log("No missing events.");
		return new Response("No missing events.");
	}
	console.log(
		`Added ${events.length} to queue: ${events.map(e => e.id).join(", ")}.`
	);
	withBrowserless(
		events.map(event => browser => scrapePastEvent(event.id, browser))
	);
	return new Response(
		`Added ${events.length} to queue: ${events.map(e => e.id).join(", ")}.`
	);
}
