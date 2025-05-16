import assert from "assert";
import { QUERIES } from "~/server/db/queries";
import { Bracket } from "./bracket";
import { getEventStatus } from "../getEventStatus";
import { redirect } from "next/navigation";
import { router } from "~/lib/router";

export const revalidate = false;

export async function generateStaticParams() {
	return (await QUERIES.getEventsWithResults()).map(e => ({
		id: e.id.toString(),
	}));
}

export default async function BracketPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const eventId = Number(id);
	assert(!isNaN(eventId), "Event ID must be a number");
	const event = await QUERIES.getEvent(eventId);
	if (event.type == "TEAM") {
		return <p>{"Team results aren't supported yet."}</p>;
	}
	if (!event.hasResults) {
		const status = getEventStatus(event);
		console.log("Event status: ", status);
		if (status == "LIVE") {
			redirect(router.event(eventId).bracket.live);
		}
		return <p>This event does not have results.</p>;
	}
	const bouts = await QUERIES.getPastTableau(event.id);
	return <Bracket bouts={bouts} />;
}
