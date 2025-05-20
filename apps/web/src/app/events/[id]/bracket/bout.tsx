import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { cn, formatRelativeDate, toTitleCase } from "~/lib/utils";
import { Flag } from "~/components/custom/flag";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Fragment, useEffect, useState } from "react";
import { getHeadToHeadBouts } from "~/server/actions";
import assert from "assert";
import type { BracketBout, PastBoutModel } from "~/lib/models";
import { Skeleton } from "~/components/ui/skeleton";
import { RoundBadge } from "./round-badge";
import Link from "next/link";
import { router } from "~/lib/router";
import { buttonVariants } from "~/components/ui/button";
import { ChevronRight, Info } from "lucide-react";

export function Bout({ bout, hidden }: { bout: BracketBout; hidden: boolean }) {
	const fencerA = "fencerA" in bout ? bout.fencerA : undefined;
	const fencerB = "fencerB" in bout ? bout.fencerB : undefined;
	if (!fencerA || !fencerB) {
		return <BoutCard bout={bout} hidden={hidden} info={false} />;
	}
	assert(bout.id);
	return (
		<Dialog>
			<DialogTrigger>
				<BoutCard bout={bout} hidden={hidden} info={true} />
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Head-to-head</DialogTitle>
				<HeadToHead
					boutId={bout.id}
					fencerA={fencerA}
					fencerB={fencerB}
				/>
				<p className="text-xs">Only 24-25 season included.</p>
			</DialogContent>
		</Dialog>
	);
}

function BoutCard({
	bout,
	hidden,
	info,
}: {
	bout: BracketBout;
	hidden: boolean;
	info: boolean;
}) {
	const fencerA = "fencerA" in bout ? bout.fencerA : undefined;
	const fencerB = "fencerB" in bout ? bout.fencerB : undefined;
	return (
		<Card
			className={cn(
				"p-3 transition-all duration-100 ease-in rounded-md gap-0",
				hidden && "h-0 p-0",
				info && "hover:bg-muted"
			)}
		>
			<CardContent className="p-0 flex flex-col gap-1">
				<Fencer
					fencer={fencerA}
					winner={
						bout.winnerIsA !== undefined && bout.winnerIsA == true
					}
				/>
				<Fencer
					fencer={fencerB}
					winner={
						bout.winnerIsA !== undefined && bout.winnerIsA == false
					}
				/>
			</CardContent>
			{info && (
				<CardFooter className="text-[10px] text-muted-foreground p-0 font-semibold items-center justify-end flex-row">
					<p>Head-to-head</p>
					<ChevronRight size={12} />
				</CardFooter>
			)}
		</Card>
	);
}

function HeadToHead({
	fencerA,
	fencerB,
	boutId,
}: {
	boutId: number;
	fencerA: NonNullable<BracketBout["fencerA"]>;
	fencerB: NonNullable<BracketBout["fencerB"]>;
}) {
	const [bouts, setBouts] = useState<
		Awaited<ReturnType<typeof getHeadToHeadBouts>> | undefined
	>(undefined);
	useEffect(() => {
		const updateBouts = async () => {
			const pastBouts = (
				await getHeadToHeadBouts(fencerA.id, fencerB.id)
			).filter(b => b.id != boutId);
			setBouts(pastBouts);
		};
		updateBouts();
	}, []);
	if (bouts == undefined) {
		return (
			<>
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
			</>
		);
	}
	if (bouts.length == 0) {
		return <p>No bouts found.</p>;
	}
	return bouts.map(b => (
		<Fragment key={b.id}>
			<div className="flex flex-row justify-between flex-wrap items-end">
				<div className="flex flex-col text-sm">
					<Link
						href={router.event(b.event.id).bracket.past}
						className={cn(
							buttonVariants({ variant: "link" }),
							"p-0"
						)}
					>
						<p className="font-semibold">{b.competition}</p>
					</Link>
					<p>{formatRelativeDate(b.event.date)}</p>
				</div>
				<RoundBadge className="text-sm" roundKey={b.round} />
			</div>
			<BoutCard bout={b} hidden={false} info={false} />
		</Fragment>
	));
}

function Fencer({
	fencer,
	winner,
}: {
	fencer?: {
		firstName: string;
		lastName: string;
		score?: number;
		flag?: string;
	};
	winner?: boolean;
}) {
	return fencer ? (
		<div
			className={cn(
				"flex justify-between text-sm",
				winner && "font-bold"
			)}
		>
			<div className="flex items-center gap-1 truncate">
				<Flag
					flagCode={fencer.flag}
					className="flex-shrink-0 w-6 h-4"
				/>
				<div className="truncate">
					{fencer ? (
						<>
							<span className="">
								{toTitleCase(fencer.lastName)}
							</span>
							{", "}
							<span className="text-xs">
								{toTitleCase(fencer.firstName)}
							</span>
						</>
					) : (
						""
					)}
				</div>
			</div>
			<div>{fencer?.score !== undefined ? fencer.score : "-"}</div>
		</div>
	) : (
		<div className="flex justify-between opacity-50">
			{" "}
			{/* Grey out if fencerB is missing */}
			<div className="truncate">TBD</div>
			<div>-</div>
		</div>
	);
}
