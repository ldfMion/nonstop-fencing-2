"use client";
import { cn, formatRelativeDate } from "~/lib/utils";
import { Fragment, JSX } from "react";
import type { Round } from "~/lib/models";
import { Skeleton } from "~/components/ui/skeleton";
import { RoundBadge } from "./round-badge";
import Link from "next/link";
import { router } from "~/lib/router";
import { buttonVariants } from "~/components/ui/button";
import { MatchCard } from "./match-card";
import { useQuery } from "@tanstack/react-query";
import { DialogTitle } from "~/components/ui/dialog";

type Match = {
	top: Entity;
	bottom: Entity;
	id: number;
	winnerIsA?: boolean;
	event: {
		id: number;
		date: Date;
	};
	competition: string;
	round: Round;
	bracket?: string;
};

type Entity = {
	primaryName: string;
	secondaryName: string;
	score?: number;
	flag?: string;
};

export function HeadToHead({
	boutId,
	getMatches,
}: {
	boutId?: number;
	getMatches: () => Promise<Match[]>;
}) {
	const {
		data: matches,
		isLoading,
		isError,
		isSuccess,
	} = useQuery({
		queryKey: ["head-to-head", boutId],
		queryFn: getMatches,
		select: matches => matches.filter(b => b.id != boutId),
	});
	let content: JSX.Element;
	if (isError) {
		content = <p>There was an error</p>;
	} else if (!isSuccess || isLoading) {
		content = (
			<>
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
			</>
		);
	} else if (matches.length == 0) {
		content = <p>No bouts found.</p>;
	} else {
		content = (
			<>
				{matches.map(match => (
					<Fragment key={match.id}>
						<div className="flex flex-row justify-between flex-wrap items-end">
							<div className="flex flex-col text-sm">
								<Link
									href={
										router.event(match.event.id).bracket
											.past
									}
									className={cn(
										buttonVariants({
											variant: "link",
										}),
										"p-0"
									)}
								>
									<p className="font-semibold">
										{match.competition}
									</p>
								</Link>
								<p>{formatRelativeDate(match.event.date)}</p>
							</div>
							<RoundBadge
								className="text-sm"
								roundKey={Number(match.round) as Round}
								bracket={match.bracket}
							/>
						</div>
						<MatchCard match={match} hidden={false} info={false} />
					</Fragment>
				))}
			</>
		);
	}
	return (
		<>
			<DialogTitle>Head-to-head</DialogTitle>
			{content}
			<p className="text-xs">Only 24-25 season included.</p>
		</>
	);
}
