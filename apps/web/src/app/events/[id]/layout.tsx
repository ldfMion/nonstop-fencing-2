import { QUERIES } from "~/server/db/queries";
import { TabsNavigation } from "./tabs-navigation";
import { PageHeader } from "~/components/custom/page-header";
import { formatEventDescription } from "~/lib/utils";

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
				<TabsNavigation />
			</PageHeader>
			{children}
		</>
	);
}
