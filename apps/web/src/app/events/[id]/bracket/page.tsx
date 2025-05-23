import assert from "assert";
import { Bracket } from "./bracket";
import { getEventStatus } from "../getEventStatus";
import { redirect } from "next/navigation";
import { router } from "~/lib/router";
import { PageMessage } from "./page-message";
import { Clock, Construction } from "lucide-react";
import { getEvent, getEventsWithResults } from "~/app/events/queries";
import { getPastTableau } from "./queries";

export const dynamicParams = true;
export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
	return (await getEventsWithResults()).map(e => ({
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
	const event = await getEvent(eventId);
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
	const bouts = await getPastTableau(event.id);
	return <Bracket bouts={bouts} />;
}
