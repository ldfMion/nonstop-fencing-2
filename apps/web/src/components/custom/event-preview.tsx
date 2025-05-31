import Link from "next/link";
import { Button } from "../ui/button";
import { router } from "~/lib/router";
import {
	formatEventDescription,
	formatRelativeDate,
	toTitleCase,
} from "~/lib/utils";
import { BracketIndicator, WinnerIndicator } from "./indicator-badges";
import { ChevronRight } from "lucide-react";

export function EventPreview({
	event,
	showBracketIndicator,
	showDate = false,
}: {
	event: {
		weapon: "FOIL" | "EPEE" | "SABER";
		type: "INDIVIDUAL" | "TEAM";
		gender: "MEN" | "WOMEN";
		date: Date;
		id: number;
		winner?: {
			name: string;
			flag: string;
		};
	};

	showDate?: boolean;
	showBracketIndicator: boolean;
}) {
	console.log("in event preview");
	console.log(event);
	return (
		<Button
			className="rounded-none h-fit w-full flex flex-row justify-between !p-4"
			variant="ghost"
			asChild
		>
			<Link href={router.event(event.id).overview}>
				<div className="flex flex-col gap-1">
					<p className="text-primary text-md font-semibold">
						{formatEventDescription(event)}
					</p>
					{showDate && (
						<p className="font-semibold text-xs text-muted-foreground">
							{formatRelativeDate(event.date)}
						</p>
					)}
				</div>
				<div className="flex flex-row items-center gap-1">
					{event.winner && (
						<WinnerIndicator
							text={toTitleCase(event.winner.name)}
							flagCode={event.winner.flag}
						/>
					)}
					{showBracketIndicator && <BracketIndicator />}
					<ChevronRight />
				</div>
			</Link>
		</Button>
	);
}
