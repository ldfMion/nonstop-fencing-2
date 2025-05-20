import assert from "assert";
import { QUERIES } from "~/server/db/queries";
import { Bracket } from "./bracket";
import { getEventStatus } from "../getEventStatus";
import { redirect } from "next/navigation";
import { router } from "~/lib/router";
import { PageMessage } from "./page-message";
import { Clock, Construction } from "lucide-react";

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
		return (
			<PageMessage icon={<Construction size={24} />}>
				Results for team events are coming soon!
			</PageMessage>
		);
	}
	if (!event.hasResults) {
		const status = getEventStatus(event);
		console.log("Event status: ", status);
		if (status == "LIVE") {
			redirect(router.event(eventId).bracket.live);
		}
		if (status == "FUTURE") {
			return (
				<PageMessage icon={<Clock size={24} />}>
					Results will be available as soon as the event starts. Come
					back later!
				</PageMessage>
			);
		}
		return <PageMessage>This event does not have results.</PageMessage>;
	}
	const bouts = await QUERIES.getPastTableau(event.id);
	return <Bracket bouts={bouts} />;
}
