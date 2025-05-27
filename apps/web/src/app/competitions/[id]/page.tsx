import { PageHeader } from "~/components/custom/page-header";
import {
	formatEventDescription,
	formatRelativeDate,
	getDateRange,
	isToday,
} from "~/lib/utils";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ChevronRight, Network } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Fragment } from "react";
import { router } from "~/lib/router";
import { getCompetition, getCompetitions } from "../queries";
import { BracketIndicator } from "~/components/custom/indicator-badges";
import { Badge } from "~/components/ui/badge";

export const dynamicParams = true;
export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
	const competitions = await getCompetitions(2025);
	return competitions.map(c => ({ id: c.id.toString() }));
}

export default async function CompetitionPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: competitionId } = await params;
	const competition = await getCompetition(Number(competitionId));
	if (!competition) {
		notFound();
	}

	const eventsByDate = competition.events.reduce((acc, event) => {
		const date = event.date.toISOString().split("T")[0]!;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(event);
		return acc;
	}, {} as Record<string, typeof competition.events>);

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
										<Link
											href={router.event(e.id).overview}
										>
											<div className="flex flex-row items-center gap-2">
												<h4>
													{formatEventDescription(e)}
												</h4>
												{(e.hasResults ||
													isToday(e.date)) && (
													<BracketIndicator />
												)}
											</div>
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

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: competitionId } = await params;
	const competition = await getCompetition(Number(competitionId));
	if (!competition) {
		return {};
	}
	const title = competition.name + " | Nonstop Fencing";
	const description = `Results for ${
		competition.name
	} happening ${getDateRange(competition.date)}`;
	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			images: competition.flag && [
				`https://flagcdn.com/w1280/${competition.flag.toLowerCase()}.png`,
			],
		},
	};
}
