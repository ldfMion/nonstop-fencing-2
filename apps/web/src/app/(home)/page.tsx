import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Flag } from "~/components/custom/flag";
import { EventModel } from "~/lib/models";
import { router } from "~/lib/router";
import {
	formatEventDescription,
	formatFullDate,
	formatRelativeDate,
	getToday,
} from "~/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import { getFirstCompetition } from "./queries";
import { Fragment, Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { differenceInCalendarDays } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import assert from "assert";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { weapon } = await searchParams;
	assert(typeof weapon === "string" || weapon === undefined);
	const parsed = parseWeaponParam(weapon);
	return (
		<main className="p-6 max-w-3xl mx-auto flex flex-col gap-4">
			<Card className="p-2 items-center self-center">
				<ToggleGroup
					type="single"
					value={parsed ?? "all"}
					defaultValue="all"
				>
					<Link href="/" passHref>
						<ToggleGroupItem value="all">All</ToggleGroupItem>
					</Link>
					<Link href="/?weapon=foil" passHref>
						<ToggleGroupItem value="FOIL">Foil</ToggleGroupItem>
					</Link>
					<Link href="/?weapon=epee" passHref>
						<ToggleGroupItem value="EPEE">Epee</ToggleGroupItem>
					</Link>
					<Link href="/?weapon=saber" passHref>
						<ToggleGroupItem value="SABER">Saber</ToggleGroupItem>
					</Link>
				</ToggleGroup>
			</Card>
			<Card className=" p-6">
				<CardTitle className="text-2xl">Up Next</CardTitle>
				<Suspense fallback={<Skeleton className="h-20" />} key={weapon}>
					<UpNext weapon={parsed} />
				</Suspense>
			</Card>
			<Card className="  p-6">
				<CardHeader className="flex flex-row justify-between items-center">
					<CardTitle>Completed</CardTitle>
					<Button asChild variant="default">
						<Link href={router.competitions()}>
							All Competitions
							<ChevronRight size={24} />
						</Link>
					</Button>
				</CardHeader>
				<Suspense fallback={<Skeleton className="h-20" />} key={weapon}>
					<Completed weapon={parsed} />
				</Suspense>
			</Card>
		</main>
	);
}

async function UpNext({
	weapon,
}: {
	weapon: "FOIL" | "EPEE" | "SABER" | undefined;
}) {
	const nextCompetition = await getFirstCompetition(true, weapon);
	console.log(nextCompetition);
	const daysUntilNext = nextCompetition
		? differenceInCalendarDays(nextCompetition.events[0].date, getToday())
		: null;

	return nextCompetition ? (
		<>
			<div className="items-center flex flex-col md:flex-row gap-6">
				{daysUntilNext != 0 && (
					<p className=" text-xl font-semibold text-nowrap px-8">
						<>
							In <span className="text-8xl">{daysUntilNext}</span>{" "}
							{daysUntilNext == 1 ? "day" : "days"}
						</>
					</p>
				)}
				<div className="w-full">
					<CompetitionCard
						competitionId={nextCompetition.id}
						events={nextCompetition.events.map(e => ({
							name: formatEventDescription(e),
							date: formatRelativeDate(e.date),
							id: e.id,
							live:
								differenceInCalendarDays(e.date, getToday()) ==
								0,
						}))}
						name={nextCompetition.name}
						flag={nextCompetition.flag}
					/>
				</div>
			</div>
		</>
	) : null;
}

async function Completed({
	weapon,
}: {
	weapon: "FOIL" | "EPEE" | "SABER" | undefined;
}) {
	const previousCompetition = await getFirstCompetition(false, weapon);
	return previousCompetition ? (
		<CompetitionCard
			competitionId={previousCompetition.id}
			events={previousCompetition.events.map(e => ({
				name: formatEventDescription(e),
				date: formatFullDate(e.date),
				id: e.id,
			}))}
			name={previousCompetition.name}
			flag={previousCompetition.flag}
		/>
	) : null;
}

function CompetitionCard({
	name,
	flag,
	events,
	competitionId,
}: {
	name: string;
	flag?: string;
	events: { name: string; date: string; id: number; live?: boolean }[];
	competitionId: number;
}) {
	return (
		<Card className="">
			<CardHeader className="flex flex-row items-center w-full">
				<Flag
					flagCode={flag}
					className="w-15 h-10 rounded-[8px] gap-2"
				/>
				<div className="w-full min-w-0">
					<Button
						variant="link"
						asChild
						className="w-full p-0 justify-start"
					>
						<Link
							href={router.competition(competitionId)}
							className="w-full min-w-0"
						>
							<CardTitle className="text-lg sm:text-2xl font-semibold break-words text-wrap w-full leading-none">
								{name}
							</CardTitle>
						</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<CardDescription className="font-semibold text-sm flex flex-col">
					{events.map(e => (
						<Fragment key={e.id}>
							<Button
								key={e.id}
								className="flex items-center flex-row justify-between py-6"
								variant="ghost"
								asChild
							>
								<Link href={router.event(e.id).overview}>
									<div className="flex flex-col gap-1">
										<div className="flex flex-row gap-2">
											<p className="text-primary">
												{e.name}
											</p>
											{e.live && (
												<Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white uppercase">
													<div className="flex items-center gap-1.5">
														<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
														Live
													</div>
												</Badge>
											)}
										</div>
										<p className="font-semibold text-xs text-muted-foreground">
											{e.date}
										</p>
									</div>
									<ChevronRight />
								</Link>
							</Button>
						</Fragment>
					))}
				</CardDescription>
			</CardContent>
		</Card>
	);
}

function parseWeaponParam(param: string | undefined) {
	switch (param) {
		case "foil":
			return "FOIL";
		case "epee":
			return "EPEE";
		case "saber":
			return "SABER";
		default:
			return undefined;
	}
}
