import { QUERIES } from "~/server/db/queries";
import { TabsNavigation } from "../../../components/custom/tabs-navigation";
import { PageHeader } from "~/components/custom/page-header";
import { formatEventDescription, formatRelativeDate } from "~/lib/utils";
import { Calendar } from "lucide-react";
import { router } from "~/lib/router";
import assert from "assert";

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
	const event = await QUERIES.getEvent(eventId);
	const subpages: { url: string; title: string }[] = [
		{ url: router.event(eventId).overview, title: "Overview" },
		{ url: router.event(eventId).bracket.past, title: "Bracket" },
	];
	return (
		<main>
			<PageHeader
				flagCode={event.flag}
				title={event.name}
				description={formatEventDescription(event)}
			>
				<div className="flex flex-row justify-between w-full">
					<TabsNavigation subpages={subpages} />
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
