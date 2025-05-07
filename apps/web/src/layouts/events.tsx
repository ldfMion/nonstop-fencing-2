import { QUERIES } from "~/server/db/queries";
import { EventsList } from "./events-list";

export async function Events() {
	const c = await QUERIES.getCompetitions();
	return (
		<div className="p-6">
			<EventsList competitions={c} />
		</div>
	);
}
