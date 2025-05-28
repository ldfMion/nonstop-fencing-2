import { router } from "~/lib/router";
import { revalidatePath } from "next/cache";
import { Browser, withBrowserless } from "../../infra/scraping/browserless";
import { getIndividualEventData, getTeamEventData } from "~/infra/scraping/fie";
import {
	mapFieTableauToBouts,
	mapFieTableauToFencers,
} from "~/infra/scraping/fie/mappers";
import { savePastBouts } from "../bouts";
import {
	getEventsWithMissingResults,
	savePastTeamRelays,
	updateEventsResultsInformation,
} from "./queries";
import { EventModel } from "~/lib/models";
import {
	getCountriesFromRelays,
	mapScrapedTeamRelaysToNewRelayDto,
} from "./mappers";
import { saveCountries } from "../countries";

type Event = EventModel;

export async function updatePastResults(): Promise<void> {
	const events = await getEventsWithMissingResults();
	if (events.length == 0) {
		console.log("No missing events.");
		return;
	}
	console.log(
		`Added ${events.length} to queue: ${events
			.map(e => `${e.id} (${e.type})`)
			.join(", ")}.`
	);
	await withBrowserless([
		async browser => {
			await updatePastEvents(events, browser);
		},
	]);
	console.log(
		`Updated ${events.length} events: ${events.map(e => e.id).join(", ")}.`
	);
}

async function updatePastEvents(events: Event[], browser: Browser) {
	const individualEvents = events.filter(e => e.type == "INDIVIDUAL");
	await updateIndividualEvents(individualEvents, browser);
	const teamEvents = events.filter(e => e.type == "TEAM");
	await updateTeamEvents(teamEvents, browser);
	events.forEach(event =>
		revalidatePath(router.event(event.id).bracket.past)
	);
}

async function updateTeamEvents(events: Event[], browser: Browser) {
	const preparedRelays = await getPreparedRelaysForAllEvents(events, browser);
	// console.log(preparedRelays);
	const countries = getCountriesFromRelays(preparedRelays);
	await saveCountries(countries);
	await savePastTeamRelays(preparedRelays);
	await updateEventsResultsInformation(events.map(e => e.id));
}

async function updateIndividualEvents(events: Event[], browser: Browser) {
	return Promise.all(
		events.map(event => updateIndividualEvent(event, browser))
	);
}

async function getPreparedRelaysForAllEvents(
	events: Event[],
	browser: Browser
) {
	return (
		await Promise.all(
			events.map(async e => {
				const scrapedRelays = await getTeamEventData(e, browser);
				const preparedForDb = mapScrapedTeamRelaysToNewRelayDto(
					scrapedRelays,
					e
				);
				return preparedForDb;
			})
		)
	).flat();
}

async function updateIndividualEvent(event: Event, browser: Browser) {
	const t = await getIndividualEventData(event, browser);
	await savePastBouts(t, event, mapFieTableauToFencers, mapFieTableauToBouts);
}
