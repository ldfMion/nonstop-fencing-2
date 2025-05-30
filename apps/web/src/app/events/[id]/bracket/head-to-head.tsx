"use client";
import { cn, formatRelativeDate } from "~/lib/utils";
import { Fragment, JSX } from "react";
import { getBoutsBetweenFencers } from "./queries";
import type { Round } from "~/lib/models";
import { Skeleton } from "~/components/ui/skeleton";
import { RoundBadge } from "./round-badge";
import Link from "next/link";
import { router } from "~/lib/router";
import { buttonVariants } from "~/components/ui/button";
import { MatchCard } from "./match-card";
import { useQuery } from "@tanstack/react-query";
import { DialogTitle } from "~/components/ui/dialog";
import { mapBoutToMatch } from "./map-bout-to-match";

export function HeadToHead({
	entityA,
	entityB,
	boutId,
}: {
	boutId: number;
	entityA: { id: number };
	entityB: { id: number };
}) {
	const {
		data: bouts,
		isLoading,
		isError,
		isSuccess,
	} = useQuery({
		queryKey: ["head-to-head", boutId],
		queryFn: () => getBoutsBetweenFencers(entityA.id, entityB.id),
		select: bouts => bouts.filter(b => b.id != boutId),
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
	} else if (bouts.length == 0) {
		content = <p>No bouts found.</p>;
	} else {
		content = (
			<>
				{bouts.map(b => (
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
									<p className="font-semibold">
										{b.competition}
									</p>
								</Link>
								<p>{formatRelativeDate(b.event.date)}</p>
							</div>
							<RoundBadge
								className="text-sm"
								roundKey={Number(b.round) as Round}
							/>
						</div>
						<MatchCard
							match={mapBoutToMatch(b)}
							hidden={false}
							info={false}
						/>
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
