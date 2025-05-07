import { QUERIES } from "~/server/db/queries";
import { EventsList } from "./events-list";

export async function Events() {
	const events = await QUERIES.getEvents();
	return (
		<div className="p-6">
			<EventsList events={events} />
		</div>
	);
}
