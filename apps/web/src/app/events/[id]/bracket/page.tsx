import assert from "assert";
import { getEventStatus } from "../getEventStatus";
import { redirect } from "next/navigation";
import { router } from "~/lib/router";
import { PageMessage } from "./page-message";
import { Clock, Construction } from "lucide-react";
import { getEvent, getEventsWithResults } from "~/app/events/queries";
import { getPastBouts, getPastRelaysMainBracket } from "./queries";
import { IndividualBracket } from "./individual-bracket";
import { TeamBracket } from "./team-bracket";

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
	if (!event.hasResults) {
		const status = getEventStatus(event);
		console.log("Event status: ", status);
		if (status == "LIVE") {
			if (event.type == "TEAM") {
				redirect(router.event(eventId).bracket.live);
			}
			return (
				<PageMessage icon={<Construction size={24} />}>
					Live results for team events aren't supported yet.
				</PageMessage>
			);
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
	if (event.type == "INDIVIDUAL") {
		const bouts = await getPastBouts(event.id);
		return <IndividualBracket bouts={bouts} />;
	}
	const relays = await getPastRelaysMainBracket(event.id);
	return (
		<TeamBracket
			relays={relays}
			gender={event.gender}
			weapon={event.weapon}
		/>
	);
}
