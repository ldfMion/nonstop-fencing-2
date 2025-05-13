import { PageHeader } from "~/components/custom/page-header";
import {
	formatEventDescription,
	formatRelativeDate,
	getDateRange,
} from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { format, formatRelative } from "date-fns";
import { Fragment } from "react";

export default async function CompetitionPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: competitionId } = await params;
	const competition = await QUERIES.getCompetition(Number(competitionId));
	if (!competition) {
		notFound();
	}

	const eventsByDate = competition.events.reduce(
		(acc, event) => {
			const date = event.date.toISOString().split("T")[0]!;
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(event);
			return acc;
		},
		{} as Record<string, typeof competition.events>
	);

	return (
		<>
			<PageHeader
				title={competition.name}
				description={getDateRange(competition.date)}
				flagCode={competition.flag}
			/>
			<div className="p-6">
				<Card className="max-w-2xl mx-auto gap-0 p-0">
					<CardHeader className="p-6 pb-3">
						<CardTitle>Events</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="flex flex-col gap-0 p-6 pt-3">
						{Object.entries(eventsByDate).map(([date, events]) => (
							<Fragment key={date}>
								<h3 className="font-semibold text-sm text-muted-foreground p-2">
									{formatRelativeDate(new Date(date))}
								</h3>
								<Separator />
								{events.map(e => (
									<Button
										key={e.id}
										className="flex flex-row justify-between"
										variant="link"
										asChild
									>
										<Link href={`/events/${e.id}`}>
											<h4>{formatEventDescription(e)}</h4>
											<ChevronRight />
										</Link>
									</Button>
								))}
							</Fragment>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
