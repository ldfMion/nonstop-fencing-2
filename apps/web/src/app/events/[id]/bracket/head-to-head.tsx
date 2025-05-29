import { cn, formatRelativeDate, toTitleCase } from "~/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { getBoutsBetweenFencers } from "./queries";
import type { BracketMatch, Round } from "~/lib/models";
import { Skeleton } from "~/components/ui/skeleton";
import { RoundBadge } from "./round-badge";
import Link from "next/link";
import { router } from "~/lib/router";
import { buttonVariants } from "~/components/ui/button";
import { BoutCard } from "./bout-card";
import { useQuery } from "@tanstack/react-query";

export function HeadToHead({
	fencerA,
	fencerB,
	boutId,
}: {
	boutId: number;
	fencerA: NonNullable<BracketMatch["fencerA"]>;
	fencerB: NonNullable<BracketMatch["fencerB"]>;
}) {
	const {
		data: bouts,
		isLoading,
		isError,
		isSuccess,
	} = useQuery({
		queryKey: ["head-to-head", boutId],
		queryFn: () => getBoutsBetweenFencers(fencerA.id, fencerB.id),
		select: bouts => bouts.filter(b => b.id != boutId),
	});
	if (isError) {
		return <p>There was an error</p>;
	}
	if (!isSuccess || isLoading) {
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
				<RoundBadge
					className="text-sm"
					roundKey={Number(b.round) as Round}
				/>
			</div>
			<BoutCard bout={b} hidden={false} info={false} />
		</Fragment>
	));
}
