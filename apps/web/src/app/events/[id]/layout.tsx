import { QUERIES } from "~/server/db/queries";
import { TabsNavigation } from "./tabs-navigation";
import { PageHeader } from "~/components/custom/page-header";
import { formatEventDescription, formatRelativeDate } from "~/lib/utils";
import { Calendar } from "lucide-react";

export default async function EventLayout({
	children,
	params,
}: {
	children: Readonly<React.ReactNode>;
	params: Promise<{ id: string }>;
}) {
	const { id: eventId } = await params;
	const event = await QUERIES.getEvent(Number(eventId));
	return (
		<>
			<PageHeader
				flagCode={event.flag}
				title={event.name}
				description={formatEventDescription(event)}
			>
				<div className="flex flex-row justify-between w-full">
					<TabsNavigation />
					<p className="text-sm font-semibold flex flex-row gap-2 items-center">
						<Calendar size={20} />
						{formatRelativeDate(event.date)}
					</p>
				</div>
			</PageHeader>
			{children}
		</>
	);
}
