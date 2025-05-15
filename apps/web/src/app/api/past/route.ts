import axios from "axios";
import { QUERIES } from "~/server/db/queries";

export async function POST() {
	const events = await QUERIES.getEventsWithFieResults();
	await Promise.all(
		events.map(async event => {
			await axios.post(`http://localhost:3000/api/past/${event.id}`);
		})
	);
	return new Response("finished1");
}
