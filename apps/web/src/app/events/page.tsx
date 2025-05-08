import { EventsList } from "~/app/events/events-list";
import { QUERIES } from "~/server/db/queries";

export default async function EventsPage() {
	const c = await QUERIES.getCompetitions();
	return <EventsList competitions={c} />;
}
