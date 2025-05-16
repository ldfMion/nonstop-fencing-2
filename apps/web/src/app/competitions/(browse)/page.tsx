"server only";

import { EventsList } from "~/app/competitions/(browse)/events-list";
import { QUERIES } from "~/server/db/queries";
import { parseCompetitionSearchParams } from "~/lib/router";

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	console.log("rendering page");
	const parsed = parseCompetitionSearchParams(await searchParams);
	const filters = {
		season: 2025,
		gender: parsed?.gender?.toUpperCase() as "MEN" | "WOMEN" | undefined,
		weapon: parsed?.weapon?.toUpperCase() as
			| "FOIL"
			| "EPEE"
			| "SABER"
			| undefined,
		type: parsed?.type?.toUpperCase() as "INDIVIDUAL" | "TEAM" | undefined,
		upcoming: parsed?.status == "upcoming",
	};
	const c = await QUERIES.getCompetitions(filters);
	return (
		<main>
			<EventsList competitions={c} />
		</main>
	);
}
