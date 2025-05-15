import assert from "assert";
import { QUERIES } from "~/server/db/queries";
import { getEventData } from "~/server/scraping/fie";
import {
	mapFieTableauToBouts,
	mapFieTableauToFencers,
} from "~/server/scraping/fie/mappers";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	console.log("called api route for event", id);
	const eventId = Number(id);
	assert(!isNaN(eventId), "event id has to be a number");
	const event = await QUERIES.getEvent(eventId);
	const t = await getEventData(event);
	console.log(t);
	const newFencers = mapFieTableauToFencers(t, event.gender);
	console.log(newFencers);
	await QUERIES.insertCountries(
		newFencers.map(f => ({
			iocCode: f.country,
		}))
	);
	await QUERIES.insertFencers(newFencers);
	const uploadedFencers = await QUERIES.getFencers({
		firstName: newFencers.map(f => f.firstName),
		lastName: newFencers.map(f => f.lastName),
	});
	const bouts = mapFieTableauToBouts(t, uploadedFencers, event.id);
	console.log(bouts);
	await QUERIES.insertPastBouts(bouts);
	QUERIES.updateEvent(event, {
		hasFieResults: true,
		hasResults: true,
	});
	return Response.json({});
}
