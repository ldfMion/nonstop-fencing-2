import { Badge } from "~/components/ui/badge";
import { Flag } from "~/components/custom/flag";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { router } from "~/lib/router";
import Link from "next/link";
import { Fragment } from "react";
import { Separator } from "~/components/ui/separator";

export type RankingData = {
	points: string;
	position: number;
	flag?: string;
	fencer?: {
		firstName: string;
		lastName: string;
		id: number;
	};
	team?: {
		name: string;
		id: string;
	};
} & (
	| {
			fencer: {
				firstName: string;
				lastName: string;
				id: number;
			};
	  }
	| {
			team: {
				name: string;
				id: string;
			};
	  }
);

export function RankingTable({
	data,
	showHeader,
	showPoints,
}: {
	data: RankingData[];
	showHeader: boolean;
	showPoints: boolean;
}) {
	return (
		<div className="table-fixed w-full">
			{showHeader && (
				<div className="bg-muted flex flex-row justify-between items-center p-4 pt-2">
					<div className="flex flex-row items-center gap-2">
						<p className="font-semibold">Rank</p>
						<p className="font-semibold">Fencer</p>
					</div>

					{showPoints && (
						<p className="text-right font-semibold w-24">Points</p>
					)}
				</div>
			)}
			{data.map(ranking => (
				<Fragment key={`${ranking.fencer?.id} ${ranking.team?.id} `}>
					<Separator />
					<Link
						href={
							ranking.fencer
								? router.fencer(ranking.fencer?.id)
								: ""
						}
						className="flex flex-row items-center justify-between px-4 py-2 hover:bg-accent"
					>
						<div className="flex flex-row items-center gap-4">
							<PositionBadge position={ranking.position} />
							<div>
								<div className="flex items-center gap-3 w-full">
									{ranking.flag && (
										<Flag
											flagCode={ranking.flag}
											className="w-6 h-4 rounded-[6px] flex-shrink-0"
										/>
									)}
									<p className="capitalize !truncate w-full">
										<span className="font-bold text-foreground">
											{ranking.fencer &&
												ranking.fencer.lastName + ","}
											{ranking.team && ranking.team.name}
										</span>{" "}
										{ranking.fencer && (
											<span className="text-foreground">
												{ranking.fencer.firstName}
											</span>
										)}
									</p>
								</div>
							</div>
						</div>
						{showPoints && (
							<div className="text-right">
								<Badge
									variant="secondary"
									className="font-mono font-semibold text-sm"
								>
									{ranking.points}
								</Badge>
							</div>
						)}
					</Link>
				</Fragment>
			))}
		</div>
	);
}
function PositionBadge({ position }: { position: number }) {
	let className;
	switch (position) {
		case 1:
			className = "bg-yellow-200 text-yellow-800 border-yellow-500";
			break;
		case 2:
			className = "bg-slate-200 text-slate-800 border-slate-500";
			break;
		case 3:
			className = "bg-orange-200 text-orange-800 border-orange-500";
			break;
		default:
			className = "";
	}
	return (
		<Badge
			variant={position <= 16 ? "default" : "outline"}
			className={cn(
				"w-8 h-8 rounded-full flex items-center justify-center p-0 text-sm font-semibold",
				className
			)}
		>
			{position}
		</Badge>
	);
}
