"use client";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { router } from "~/lib/router";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
export function EventTabs({
	eventId,
	competitionId,
}: {
	eventId: number;
	competitionId: number;
}) {
	const segment = useSelectedLayoutSegment();
	const active = !segment
		? "overview"
		: segment.includes("bracket")
		? "bracket"
		: undefined;
	return (
		<Tabs value={active}>
			<TabsList>
				{/* <TabsTrigger value="overview">
					<Link href={router.competition(competitionId)}>
						Overview
					</Link>
				</TabsTrigger> */}
				<TabsTrigger value="bracket">
					<Link href={router.event(eventId).bracket.past}>
						Bracket
					</Link>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
