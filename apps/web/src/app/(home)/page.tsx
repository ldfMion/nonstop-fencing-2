import Link from "next/link";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Flag } from "~/components/custom/flag";
import { router } from "~/lib/router";
import { formatEventDescription, getToday, toTitleCase } from "~/lib/utils";
import { ChevronRight, Medal } from "lucide-react";
import {
	getCompetitionsWithEvents,
	getTodaysEvents,
	getTopRankings,
} from "./queries";
import { Fragment, ReactNode, Suspense } from "react";
import { Button } from "~/components/ui/button";
import { differenceInCalendarDays } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import assert from "assert";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { EventPreview } from "~/components/custom/event-preview";
import { CustomCard } from "~/components/custom/custom-card";

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { weapon } = await searchParams;
	assert(typeof weapon === "string" || weapon === undefined);
	const parsed = parseWeaponParam(weapon);
	return (
		<main className="p-4  flex flex-col gap-4 max-w-6xl mx-auto">
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
				<div className="md:grid-cols-2 lg:col-span-4 flex flex-col gap-4">
					<TodayOrUpNext weapon={parsed} />
					<div className="flex flex-row justify-between items-center gap-0">
						<h2 className="text-xl font-bold">Last Competition</h2>
						<Button asChild variant="default">
							<Link href={router.competitions()}>
								View All
								<ChevronRight size={18} />
							</Link>
						</Button>
					</div>
					<Suspense
						fallback={<Skeleton className="h-30" />}
						key={weapon}
					>
						<Completed weapon={parsed} />
					</Suspense>
				</div>
				<div className="md:grid-cols-1 lg:col-span-2">
					<Suspense
						fallback={<Skeleton className="h-100" />}
						key={weapon}
					>
						<RankingPreview weapon={parsed} />
					</Suspense>
				</div>
			</div>
		</main>
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
			<Suspense fallback={<Skeleton className="h-70" />} key={weapon}>
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
		await getCompetitionsWithEvents({
			next: true,
			numCompetitions: 1,
			weapon,
			numEventsPerCompetition: 3,
		})
	)[0];
	const daysUntilNext = nextCompetition
		? differenceInCalendarDays(nextCompetition.events[0].date, getToday())
		: null;

	return nextCompetition ? (
		<div className="items-center flex flex-col lg:flex-row gap-6">
			<div className="flex flex-col items-start h-full">
				<p className="text-2xl font-bold text-center">Up Next</p>
				<div className="h-full flex flex-col justify-center">
					{daysUntilNext != null && daysUntilNext > 0 && (
						<p className=" text-xl font-semibold text-nowrap px-8">
							<>
								In{" "}
								<span className="text-8xl">
									{daysUntilNext}
								</span>{" "}
								{daysUntilNext == 1 ? "day" : "days"}
							</>
						</p>
					)}
				</div>
			</div>
			<div className="w-full">
				<CompetitionCard
					competitionId={nextCompetition.id}
					events={nextCompetition.events}
					name={nextCompetition.name}
					flag={nextCompetition.flag}
				/>
			</div>
		</div>
	) : null;
}

async function Completed({
	weapon,
}: {
	weapon: "FOIL" | "EPEE" | "SABER" | undefined;
}) {
	const previousCompetitions = await getCompetitionsWithEvents({
		next: false,
		numCompetitions: 1,
		weapon,
	});
	return previousCompetitions.map(c => (
		<Fragment key={c.id}>
			<CompetitionCard
				competitionId={c.id}
				events={c.events}
				name={c.name}
				flag={c.flag}
			/>
		</Fragment>
	));
}

function CompetitionCard({
	name,
	flag,
	events,
	competitionId,
}: {
	name: string;
	flag?: string;
	events: {
		weapon: "FOIL" | "EPEE" | "SABER";
		type: "INDIVIDUAL" | "TEAM";
		gender: "MEN" | "WOMEN";
		date: Date;
		id: number;
		hasResults: boolean;
		winner?: {
			name: string;
			flag: string;
		};
	}[];
	competitionId: number;
}) {
	return (
		<CustomCard
			link={router.competition(competitionId)}
			headerContent={
				<div className="flex flex-row items-center gap-2">
					<Flag
						flagCode={flag}
						className="w-9 h-6 rounded-[8px] gap-2"
					/>
					<CardTitle className="text-md sm:text-lg font-semibold break-words text-wrap w-full leading-none">
						{name}
					</CardTitle>
				</div>
			}
			content={
				<div className="font-semibold text-sm flex flex-col">
					{events.map((e, index) => (
						<Fragment key={e.id}>
							{index > 0 && <Separator />}
							<EventPreview
								event={e}
								showBracketIndicator={e.hasResults}
								showDate
							/>
						</Fragment>
					))}
				</div>
			}
		/>
	);
}

async function RankingPreview({
	weapon,
}: {
	weapon?: "FOIL" | "EPEE" | "SABER";
}) {
	const { individual, teams } = await getTopRankings(weapon);
	return (
		<CustomCard
			link={router.rankings}
			headerContent={
				<div className="flex flex-row gap-2 items-center">
					<Medal />
					<CardTitle className="text-lg font-bold">
						Top Rankings
					</CardTitle>
				</div>
			}
			content={
				<div className="flex flex-col">
					{individual.map(f => (
						<Fragment key={f.fencer.id + "-individual"}>
							<Separator />
							<RankingRow
								flag={f.flag}
								name={
									<>
										{toTitleCase(f.fencer.lastName)}
										<span className="text-sm font-normal">
											, {toTitleCase(f.fencer.firstName)}
										</span>
									</>
								}
								eventDescription={formatEventDescription({
									weapon: f.weapon,
									type: "INDIVIDUAL",
									gender: f.gender,
								})}
								rankingsLink={router.ranking(
									f.gender == "MEN" ? "mens" : "womens",
									f.weapon.toLowerCase() as any,
									"individual"
								)}
								entityLink={router.fencer(f.fencer.id)}
							/>
						</Fragment>
					))}
					{teams.map(t => (
						<Fragment
							key={t.team.id + "-team" + t.weapon + t.gender}
						>
							<Separator />
							<RankingRow
								flag={t.flag}
								name={toTitleCase(t.team.name)}
								eventDescription={formatEventDescription({
									weapon: t.weapon,
									type: "TEAM",
									gender: t.gender,
								})}
								rankingsLink={router.ranking(
									t.gender == "MEN" ? "mens" : "womens",
									t.weapon.toLowerCase() as any,
									"team"
								)}
							/>
						</Fragment>
					))}
				</div>
			}
		/>
	);
}

function RankingRow({
	name,
	flag,
	eventDescription,
	rankingsLink,
	entityLink,
}: {
	name: ReactNode;
	flag?: string;
	eventDescription: string;
	rankingsLink: string;
	entityLink?: string;
}) {
	return (
		<div className="flex flex-row justify-between px-4 py-3">
			<Link
				className="flex flex-row gap-2 items-center hover:underline"
				href={entityLink ?? ""}
			>
				<Flag
					flagCode={flag}
					className="w-6 h-4 rounded-[6px] flex-shrink-0"
				/>
				<p className="font-bold truncate text-base">{name}</p>
			</Link>
			<Badge variant="secondary" className="font-semibold" asChild>
				<Link href={rankingsLink}>{eventDescription}</Link>
			</Badge>
		</div>
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
