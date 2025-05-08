import { QUERIES } from "~/server/db/queries";
import { EventsList } from "./events-list";

export async function Events() {
	const c = await QUERIES.getCompetitions();
	return (
		<div className="mx-auto px-6 max-w-xl">
			<EventsList competitions={c} />
		</div>
	);
}
