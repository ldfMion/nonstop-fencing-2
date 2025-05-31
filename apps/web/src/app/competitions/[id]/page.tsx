import { PageHeader } from "~/components/custom/page-header";
import { formatRelativeDate, getDateRange, isToday } from "~/lib/utils";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Fragment } from "react";
import { getCompetition, getCompetitions } from "../queries";
import { EventPreview } from "~/components/custom/event-preview";

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
			<div className="p-4">
				<Card className="max-w-2xl mx-auto gap-0 p-0 rounded-xl overflow-clip">
					<CardHeader className="p-6 m-0 gap-0">
						<CardTitle className="">Events</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="flex flex-col gap-0">
						{Object.entries(eventsByDate).map(([date, events]) => (
							<Fragment key={date}>
								<h3 className="text-sm bg-muted p-4">
									{formatRelativeDate(new Date(date))}
								</h3>
								{events.map(e => (
									<Fragment key={e.id}>
										<Separator />
										<EventPreview
											event={e}
											showBracketIndicator={
												e.hasResults || isToday(e.date)
											}
										/>
									</Fragment>
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
