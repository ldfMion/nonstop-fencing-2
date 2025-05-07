import { QUERIES } from "~/server/db/queries";

export async function Events() {
	const events = await QUERIES.getEvents();
	return JSON.stringify(events);
}
