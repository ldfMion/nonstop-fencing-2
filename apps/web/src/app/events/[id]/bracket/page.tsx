import { QUERIES } from "~/server/db/queries";
import { Bracket } from "./bracket";
import assert from "assert";
import { updateLiveEvent } from "~/server/live";
import { JSX } from "react";
import { env } from "~/../env";

//NEXT SETTINGS
export const revalidate = 300;
// this should make it create a static page when it is requested the first time
export const dynamic = "force-static";
export async function generateStaticParams() {
	return [];
}

const MINUTES_TO_SCRAPE_AGAIN = 900;
const DEVELOPMENT = env.MODE == "DEV";

export default async function BracketPage({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
	const { id } = await params;
	const eventId = Number(id);
	assert(!isNaN(eventId), "Event ID must be a number");
	const event = await QUERIES.getEvent(eventId);
	if (DEVELOPMENT) {
		console.log("is in development");
		const timeSinceLastUpdate = event.lastLiveUpdate
			? getMinutesSinceDate(event.lastLiveUpdate)
			: MINUTES_TO_SCRAPE_AGAIN + 1;
		console.log("event.lastLiveUpdate: ", event.lastLiveUpdate);
		console.log("Time since last update: ", timeSinceLastUpdate);
		if (timeSinceLastUpdate < MINUTES_TO_SCRAPE_AGAIN) {
			console.log("Rendering with the existing data");
			const tableau = await QUERIES.getLiveTableau(Number(id));
			return <Bracket bouts={tableau} />;
		}
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
