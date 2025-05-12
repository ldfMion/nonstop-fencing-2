"server only";

import { EventsList } from "~/app/competitions/events-list";
import { z } from "zod";
import { QUERIES } from "~/server/db/queries";

const searchParamsSchema = z
	.object({
		gender: z.literal("men").or(z.literal("women")).optional(),
		weapon: z
			.literal("foil")
			.or(z.literal("epee"))
			.or(z.literal("saber"))
			.optional(),
		type: z.literal("individual").or(z.literal("team")).optional(),
		status: z.literal("upcoming").or(z.literal("previous")).optional(),
	})
	.optional();

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	console.log("rendering page");
	const parsed = searchParamsSchema.parse(await searchParams);
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
