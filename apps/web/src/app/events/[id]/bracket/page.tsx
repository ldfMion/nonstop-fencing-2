import { QUERIES } from "~/server/db/queries";
import { Bracket } from "./bracket";
import assert from "assert";
import { updateLiveEvent } from "~/server/live";
import { JSX } from "react";
import { env } from "~/../env";

const MINUTES_TO_SCRAPE_AGAIN = 60;
export const revalidate = 900; // 15 minutes

const DEVELOPMENT = env.MODE == "DEV";

export default async function BracketPage({
	params,
}: {
	params: { id: string };
}): Promise<JSX.Element> {
	const { id } = await params;
	const eventId = Number(id);
	assert(!isNaN(eventId), "Event ID must be a number");
	const event = await QUERIES.getEvent(eventId);
	const timeSinceLastUpdate = event.lastLiveUpdate
		? getMinutesSinceDate(event.lastLiveUpdate)
		: MINUTES_TO_SCRAPE_AGAIN + 1;
	console.log("event.lastLiveUpdate: ", event.lastLiveUpdate);
	console.log("Time since last update: ", timeSinceLastUpdate);
	if (DEVELOPMENT && timeSinceLastUpdate < MINUTES_TO_SCRAPE_AGAIN) {
		console.log("Rendering with the existing data");
		const tableau = await QUERIES.getLiveTableau(Number(id));
		return <Bracket bouts={tableau} />;
	}
	console.log("Updating live event data");
	await updateLiveEvent(eventId);
	const tableau = await QUERIES.getLiveTableau(eventId);
	console.log("Rendering with the updated data");
	return <Bracket bouts={tableau} />;
}

function getMinutesSinceDate(startDate: Date): number {
	const diffInMs = new Date().getTime() - startDate.getTime();
	return Math.floor(diffInMs / (1000 * 60));
}
