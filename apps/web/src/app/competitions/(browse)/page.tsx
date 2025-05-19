import { EventsList } from "~/app/competitions/(browse)/events-list";
import { QUERIES } from "~/server/db/queries";
import { parseCompetitionSearchParams } from "~/lib/router";
import { Suspense } from "react";
import LoadingCompetitions from "./loading";

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const parsed = parseCompetitionSearchParams(await searchParams);

	return (
		<>
			<h2 className="text-xl font-semibold hidden md:block px-4">
				{parsed?.status == "upcoming" ? "Upcoming" : "Past"}
			</h2>
			<Suspense
				fallback={<LoadingCompetitions />}
				key={JSON.stringify(parsed)}
			>
				<InnerPage parsed={parsed} />
			</Suspense>
		</>
	);
}

async function InnerPage({
	parsed,
}: {
	parsed: ReturnType<typeof parseCompetitionSearchParams>;
}) {
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
	const c = await QUERIES.filterCompetitions(filters);
	return <EventsList competitions={c} />;
}
