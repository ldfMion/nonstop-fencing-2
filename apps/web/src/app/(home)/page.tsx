import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Flag } from "~/components/custom/flag";
import { router } from "~/lib/router";
import {
	formatEventDescription,
	formatFullDate,
	formatRelativeDate,
	getToday,
} from "~/lib/utils";
import { ChevronRight } from "lucide-react";
import { getCompetitionsWithEvents, getTodaysEvents } from "./queries";
import { Fragment, Suspense } from "react";
import { Button } from "~/components/ui/button";
import { differenceInCalendarDays } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import assert from "assert";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { BracketIndicator } from "~/components/custom/indicator-badges";

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { weapon } = await searchParams;
	assert(typeof weapon === "string" || weapon === undefined);
	const parsed = parseWeaponParam(weapon);
	return (
		<main className="p-4 max-w-3xl mx-auto flex flex-col gap-4">
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
			<TodayOrUpNext weapon={parsed} />

			<div className="flex flex-row justify-between items-center gap-0">
				<h2 className="text-xl font-bold">Completed</h2>
				<Button asChild variant="default">
					<Link href={router.competitions()}>
						All Competitions
						<ChevronRight size={18} />
					</Link>
				</Button>
			</div>
			<Suspense fallback={<Skeleton className="h-100" />} key={weapon}>
				<Completed weapon={parsed} />
			</Suspense>
		</main>
	);
}

async function TodayOrUpNextLoading() {
	return (
		<Card className="p-0 gap-0">
			<CardHeader className="p-6 gap-2 flex flex-row items-center">
				<CardTitle className="">Today</CardTitle>
			</CardHeader>
			<Separator />
			{new Array(3).fill(0).map((_, index) => (
				<Skeleton className="h-15 my-4 mx-6" key={index} />
			))}
		</Card>
	);
}

async function TodayOrUpNext({
	weapon,
}: {
	weapon: "FOIL" | "EPEE" | "SABER" | undefined;
}) {
	const todaysEvents = await getTodaysEvents();
	const filtered = todaysEvents.filter(
		e => weapon == undefined || e.weapon === weapon
	);
	if (filtered.length == 0) {
		return (
			<Suspense fallback={<Skeleton className="h-50" />} key={weapon}>
				<UpNext weapon={weapon} />
			</Suspense>
		);
	}
	return <Today events={filtered} />;
}

async function Today({
	events,
}: {
	events: {
		description: string;
		competitionName: string;
		id: number;
		flag: string | undefined;
	}[];
}) {
	return (
		<Card className="p-0 gap-0">
			<CardHeader className="p-6 gap-2 flex flex-row items-center">
				<Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white p-1.5 animate-pulse" />
				<CardTitle className="">Today</CardTitle>
			</CardHeader>
			{events.map(e => (
				<Fragment key={e.id}>
					<Separator />
					<Link
						href={router.event(e.id).overview}
						className="w-full min-w-0"
					>
						<Card className="rounded-none items-center bg-transparent border-none flex flex-row px-6 py-4 hover:bg-accent">
							<Flag
								flagCode={e.flag}
								className="w-12 h-8 rounded-[8px] gap-2"
							/>
							<div className="flex flex-row items-center justify-between w-full">
								<div className="flex flex-col">
									<CardTitle className="text-md font-semibold">
										{e.description}
									</CardTitle>
									<CardDescription className="">
										{e.competitionName}
									</CardDescription>
								</div>
								<ChevronRight size={24} />
							</div>
						</Card>
					</Link>
				</Fragment>
			))}
		</Card>
	);
}

async function UpNext({
	weapon,
}: {
	weapon: "FOIL" | "EPEE" | "SABER" | undefined;
}) {
	const nextCompetition = (
		await getCompetitionsWithEvents(true, 1, weapon)
	)[0];
	const daysUntilNext = nextCompetition
		? differenceInCalendarDays(nextCompetition.events[0].date, getToday())
		: null;

	return nextCompetition ? (
		<div className="">
			<p className="text-2xl font-bold">Up Next</p>
			<div className="items-center flex flex-col md:flex-row gap-6">
				{daysUntilNext != null && daysUntilNext > 0 && (
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
							hasResults: false,
						}))}
						name={nextCompetition.name}
						flag={nextCompetition.flag}
					/>
				</div>
			</div>
		</div>
	) : null;
}

async function Completed({
	weapon,
}: {
	weapon: "FOIL" | "EPEE" | "SABER" | undefined;
}) {
	const previousCompetitions = await getCompetitionsWithEvents(
		false,
		3,
		weapon
	);
	return previousCompetitions.map(c => (
		<Fragment key={c.id}>
			<CompetitionCard
				competitionId={c.id}
				events={c.events.map(e => ({
					name: formatEventDescription(e),
					date: formatFullDate(e.date),
					id: e.id,
					hasResults: e.hasResults,
				}))}
				name={c.name}
				flag={c.flag}
				innerCard={true}
			/>
		</Fragment>
	));
}

function CompetitionCard({
	name,
	flag,
	events,
	competitionId,
	innerCard = false,
}: {
	name: string;
	flag?: string;
	events: { name: string; date: string; id: number; hasResults: boolean }[];
	competitionId: number;
	innerCard?: boolean;
}) {
	return (
		<Card className={"rounded-xl p-0 gap-0 overflow-clip"}>
			<Link href={router.competition(competitionId)} className="w-full">
				<CardHeader className="flex flex-row justify-between w-full p-4 bg-muted hover:bg-accent">
					<div className="flex flex-row items-center gap-2">
						<Flag
							flagCode={flag}
							className="w-9 h-6 rounded-[8px] gap-2"
						/>
						<CardTitle className="text-md sm:text-lg font-semibold break-words text-wrap w-full leading-none">
							{name}
						</CardTitle>
					</div>
					<ChevronRight />
				</CardHeader>
			</Link>
			<CardContent>
				<CardDescription className="font-semibold text-sm flex flex-col">
					{events.map(e => (
						<Fragment key={e.id}>
							<Separator />
							<Link
								href={router.event(e.id).overview}
								className="flex items-center flex-row justify-between p-4 hover:bg-accent"
							>
								<div className="flex flex-col gap-1">
									<p className="text-primary">{e.name}</p>
									<p className="font-semibold text-xs text-muted-foreground">
										{e.date}
									</p>
								</div>
								<div className="flex flex-row items-center gap-1">
									{e.hasResults && <BracketIndicator />}
									<ChevronRight />
								</div>
							</Link>
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
