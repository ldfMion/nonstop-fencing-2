import { PageHeader } from "~/components/custom/page-header";
import { formatEventDescription, formatRelativeDate } from "~/lib/utils";
import { Calendar } from "lucide-react";
import assert from "assert";
import { EventTabs } from "./event-tabs";
import { Metadata } from "next";
import { getEvent } from "../queries";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const eventId = Number(id);
	assert(!isNaN(eventId));
	const event = await getEvent(eventId);
	const title = `${formatEventDescription(event)} | ${event.name}`;
	const description = `Results for ${title} happening on ${formatRelativeDate(
		event.date
	)}`;
	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			images: event.flag && [
				`https://flagcdn.com/w1280/${event.flag.toLowerCase()}.png`,
			],
		},
	};
}

export default async function EventLayout({
	children,
	params,
}: {
	children: Readonly<React.ReactNode>;
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const eventId = Number(id);
	assert(!isNaN(eventId));
	const event = await getEvent(eventId);
	return (
		<main>
			<PageHeader
				flagCode={event.flag}
				title={event.name}
				description={formatEventDescription(event)}
			>
				<div className="flex flex-row justify-between w-full">
					<EventTabs
						eventId={eventId}
						competitionId={event.competition}
					/>
					<p className="text-sm font-semibold flex flex-row gap-2 items-center">
						<Calendar size={20} />
						{formatRelativeDate(event.date)}
					</p>
				</div>
			</PageHeader>
			{children}
		</main>
	);
}
