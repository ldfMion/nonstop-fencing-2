// components/fencing-bout.tsx
import Image from "next/image";
import * as React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { BracketBout } from "./bracket";

export function Bout({ bout, hidden }: { bout: BracketBout; hidden: boolean }) {
	const fencerA = "fencerA" in bout ? bout.fencerA : undefined;
	const fencerB = "fencerB" in bout ? bout.fencerB : undefined;

	return (
		<Card
			className={cn(
				"p-3 transition-all duration-100 ease-in rounded-md",
				hidden && "h-0 p-0"
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
				{fencer.flag && (
					<div className="flex-shrink-0 w-6 h-4 overflow-hidden rounded-[5px]">
						<Image
							src={`https://flagcdn.com/w1280/${fencer.flag.toLowerCase()}.png`}
							alt={`${fencer.flag} flag`}
							className="w-full h-full object-cover"
							height={400}
							width={400}
						/>
					</div>
				)}
				<div className="truncate">
					{fencer?.lastName}, {fencer?.firstName || ""}
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
