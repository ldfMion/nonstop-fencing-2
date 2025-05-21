import { fetchCompetitions } from "~/infra/scraping/fie";
import {
	createName,
	mapFieEventsToDBCompetitions,
	mapFieEventToDBEvent,
} from "~/infra/scraping/fie/mappers";
import { insertCompetitions, insertEvents } from "./queries";

export async function seedCompetitions() {
	const fieEvents = await fetchCompetitions(2025);
	const newCompetitions = mapFieEventsToDBCompetitions(fieEvents);
	console.log(newCompetitions);
	const uploadedCompetitions = await insertCompetitions(newCompetitions);
	console.log(uploadedCompetitions);
	const eventsWithCompetitions = fieEvents.map(event =>
		mapFieEventToDBEvent(
			event,
			uploadedCompetitions.find(c => c.name == createName(event))!.id
		)
	);
	console.log(eventsWithCompetitions);
	insertEvents(eventsWithCompetitions);
}
