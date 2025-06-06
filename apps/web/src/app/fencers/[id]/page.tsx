import { PageHeader } from "~/components/custom/page-header";
import { getAllFencers, getEventsWithFencerBouts, getFencer } from "../queries";
import { formatRelativeDate, toTitleCase } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Flag } from "~/components/custom/flag";
import { RoundBadge } from "~/components/custom/round-badge";
import { Round } from "~/lib/models";
import { Fragment } from "react";
import { CardTitle } from "~/components/ui/card";
import { CustomCard } from "~/components/custom/custom-card";
import { ScoreIndicator } from "~/components/custom/indicator-badges";
import Link from "next/link";
import { router } from "~/lib/router";
import { Separator } from "~/components/ui/separator";

export async function generateStaticParams() {
	const fencers = await getAllFencers();
	return fencers.map(fencer => ({ id: fencer.id.toString() }));
}

export const dynamicParams = true;
export const revalidate = 86400;

export default async function FencerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const fencer = await getFencer(Number(id));
	const events = await getEventsWithFencerBouts(Number(id), 2025);
	return (
		<>
			<PageHeader
				title={toTitleCase(fencer.firstName + " " + fencer.lastName)}
				description={
					<div className="flex flex-row gap-2">
						<p>World #{fencer.rank}</p>
						<Badge variant="secondary" className="font-semibold">
							{fencer.gender.toLowerCase()}'s{" "}
							{fencer.weapon.toLowerCase()}
						</Badge>
					</div>
				}
				flagCode={fencer.flag ?? undefined}
			>
				<div className="flex flex-row gap-2 items-center w-full flex-wrap">
					<p className="font-bold text-md">Form</p>
					<>
						{events.map(e => (
							<Fragment key={e.id}>
								<Badge variant="secondary">
									<Flag
										flagCode={e.flag ?? undefined}
										className="h-4 w-5"
									/>
									{getRoundDisplayName(
										Number(e.bouts[0].round) as Round,
										e.bouts[0].won
									)}
								</Badge>
							</Fragment>
						))}
					</>
				</div>
			</PageHeader>
			<main className=" mx-auto max-w-xl p-4">
				<CustomCard
					headerContent={<CardTitle>Bouts</CardTitle>}
					content={events.map(event => (
						<div key={event.id}>
							<Separator />
							<Link
								href={router.event(event.id).bracket.past}
								className="flex flex-col items-start md:flex-row gap-2 bg-muted px-4 py-2 hover:bg-accent md:items-center justify-between"
							>
								<div className="flex flex-row gap-2 items-center">
									<Flag
										flagCode={event.flag ?? undefined}
										className="w-6 h-4 !rounded-[6px]"
									/>
									<h3 className="text-md font-semibold ">
										{event.name}
									</h3>
								</div>
								<p className="text-sm text-muted-foreground font-semibold">
									{formatRelativeDate(event.date)}
								</p>
							</Link>
							<div className="">
								{event.bouts.map(bout => (
									<Fragment key={bout.id}>
										<Separator />
										<div
											key={bout.id}
											className="grid grid-cols-4 md:grid-cols-7 px-4 py-3 gap-4"
										>
											<div className="col-span-1">
												<ScoreIndicator
													score={
														bout.scoreA >
														bout.scoreB
															? `${bout.scoreA}-${bout.scoreB}`
															: `${bout.scoreB}-${bout.scoreA}`
													}
													win={bout.won}
												/>
											</div>

											<Link
												className="col-span-2 md:col-span-5 flex flex-row gap-1 items-center hover:underline"
												href={router.fencer(
													bout.opponent.id
												)}
											>
												<Flag
													flagCode={
														bout.opponent.flag ??
														undefined
													}
													className="w-6 h-4 !rounded-[6px]"
												/>
												<p className="truncate">
													<span className="font-medium text-md">
														{toTitleCase(
															bout.opponent
																.lastName
														)}
													</span>
													,{" "}
													{toTitleCase(
														bout.opponent.firstName
													)}
												</p>
											</Link>
											<div className="col-span-1">
												<RoundBadge
													roundKey={
														Number(
															bout.round
														) as Round
													}
													className="w-full text-sm"
												/>
											</div>
										</div>
									</Fragment>
								))}
							</div>
						</div>
					))}
				/>
			</main>
		</>
	);
}

function getRoundDisplayName(round: Round, won: boolean): string {
	switch (round) {
		case 2:
			if (won) {
				return "Gold";
			}
			return "Silver";
		case 4:
			return "Bronze";
		default:
			return `T${round}`;
	}
}
