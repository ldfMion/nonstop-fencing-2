import { router } from "~/lib/router";
import { revalidatePath } from "next/cache";
import { Browser, withBrowserless } from "../../infra/scraping/browserless";
import { getEvent } from "../queries";
import { getEventData } from "~/infra/scraping/fie";
import {
	mapFieTableauToBouts,
	mapFieTableauToFencers,
} from "~/infra/scraping/fie/mappers";
import { savePastBouts } from "../bouts";
import { getEventsWithMissingResults } from "./queries";

export async function updatePastResults(): Promise<void> {
	const events = await getEventsWithMissingResults();
	if (events.length == 0) {
		console.log("No missing events.");
		return;
	}
	console.log(
		`Added ${events.length} to queue: ${events.map(e => e.id).join(", ")}.`
	);
	await withBrowserless([
		async browser => {
			await Promise.all(
				events.map(async event => {
					await scrapePastEvent(event.id, browser);
					revalidatePath(router.event(event.id).bracket.past);
				})
			);
		},
	]);
	console.log(
		`Updated ${events.length} events: ${events.map(e => e.id).join(", ")}.`
	);
}

async function scrapePastEvent(
	eventId: number,
	browser: Browser
): Promise<void> {
	const event = await getEvent(eventId);
	console.log("Event: ", event);
	const t = await getEventData(event, browser);
	await savePastBouts(t, event, mapFieTableauToFencers, mapFieTableauToBouts);
}
