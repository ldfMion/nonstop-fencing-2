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
	console.log(`Scraping event '${id}'.`);
	const eventId = Number(id);
	assert(!isNaN(eventId), "event id has to be a number");
	return Response.json({});
}
