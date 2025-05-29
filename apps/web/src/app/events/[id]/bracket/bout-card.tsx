import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { cn, toTitleCase } from "~/lib/utils";
import { Flag } from "~/components/custom/flag";
import type { BracketMatch } from "~/lib/models";
import { ChevronRight, Info } from "lucide-react";

export function BoutCard({
	bout,
	hidden,
	info,
}: {
	bout: BracketMatch;
	hidden: boolean;
	info: boolean;
}) {
	const fencerA = "fencerA" in bout ? bout.fencerA : undefined;
	const fencerB = "fencerB" in bout ? bout.fencerB : undefined;
	return (
		<Card
			className={cn(
				"p-3 transition-all duration-100 ease-in rounded-md gap-0",
				hidden && "h-0 p-0 opacity-0",
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
			<CardFooter
				className={cn(
					"text-[10px] text-muted-foreground p-0 font-semibold items-center justify-end flex-row",
					!info && "text-card"
				)}
			>
				<p>Head-to-head</p>
				<ChevronRight size={12} />
			</CardFooter>
		</Card>
	);
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
		<div className="flex justify-between opacity-50 text-sm">
			{" "}
			{/* Grey out if fencerB is missing */}
			<div className="truncate">TBD</div>
			<div>-</div>
		</div>
	);
}
