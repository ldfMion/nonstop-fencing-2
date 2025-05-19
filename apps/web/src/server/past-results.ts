import { router } from "~/lib/router";
import { QUERIES } from "./db/queries";
import { scrapePastEvent } from "./scraping/past-events";
import { revalidatePath } from "next/cache";

export async function updatePastResults(): Promise<void> {
	const events = await QUERIES.getEventsWithMissingResults();
	if (events.length == 0) {
		console.log("No missing events.");
		return;
	}
	console.log(
		`Added ${events.length} to queue: ${events.map(e => e.id).join(", ")}.`
	);
	events.map(event => {
		revalidatePath(router.event(event.id).bracket.past);
		scrapePastEvent(event.id);
	});
	console.log(
		`Updated ${events.length} events: ${events.map(e => e.id).join(", ")}.`
	);
}
