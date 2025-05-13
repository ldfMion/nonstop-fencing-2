import { PageHeader } from "~/components/custom/page-header";
import { formatEventDescription, getDateRange } from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import Link from "next/link";

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

	return (
		<>
			<PageHeader
				title={competition.name}
				description={getDateRange(competition.date)}
				flagCode={competition.flag}
			/>
			<div className="p-6">
				<Card className="gap-2">
					<CardHeader className="">
						<CardTitle>Events</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="flex flex-col gap-0">
						{competition.events.map(e => (
							<Button
								key={e.id}
								className="flex flex-row justify-between"
								variant="link"
								asChild
							>
								<Link href={`/events/${e.id}`}>
									<h3>{formatEventDescription(e)}</h3>
									<ChevronRight />
								</Link>
							</Button>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
