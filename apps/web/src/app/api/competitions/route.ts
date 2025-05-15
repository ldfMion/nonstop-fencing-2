import { QUERIES } from "~/server/db/queries";
import { fetchCompetitions } from "~/server/scraping/fie";
import {
	createName,
	mapFieEventsToDBCompetitions,
	mapFieEventToDBEvent,
} from "~/server/scraping/fie/mappers";

export async function POST() {
	const fieEvents = await fetchCompetitions(2025);
	const newCompetitions = mapFieEventsToDBCompetitions(fieEvents);
	console.log(newCompetitions);
	const uploadedCompetitions =
		await QUERIES.insertCompetitions(newCompetitions);
	console.log(uploadedCompetitions);
	const eventsWithCompetitions = fieEvents.map(event =>
		mapFieEventToDBEvent(
			event,
			uploadedCompetitions.find(c => c.name == createName(event))!.id
		)
	);
	console.log(eventsWithCompetitions);
	QUERIES.insertEvents(eventsWithCompetitions);
	return Response.json({});
}
