"use client";
import { FC, JSX } from "react";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/utils";
import { Network, Trophy } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Flag } from "./flag";

const createIndicatorBadge =
	(
		bgColor: string,
		textColor: string,
		outlineColor: string,
		Icon: FC<{ className?: string }>,
		text?: string,
		tooltip?: string
	): FC =>
	(): JSX.Element => {
		const badge = (
			<Badge
				className={cn(
					"self-center rounded-sm p-1.5",
					bgColor,
					textColor,
					outlineColor
				)}
				variant="secondary"
			>
				<Icon /> {text}
			</Badge>
		);

		if (tooltip) {
			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>{badge}</TooltipTrigger>
						<TooltipContent>{tooltip}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		}
		return badge;
	};

export const BracketIndicator = createIndicatorBadge(
	"bg-purple-400/70",
	"text-purple-800",
	"border-purple-500",
	({ className }) => <Network className={cn("rotate-90", className)} />,
	"",
	"The tableau for this event is available."
);

export const WinnerIndicator = ({
	text,
	flagCode,
}: {
	text: string;
	flagCode: string;
}) => {
	const element = createIndicatorBadge(
		"bg-yellow-200",
		"text-yellow-800",
		"border-yellow-500",
		() => (
			<>
				<Trophy />
				<Flag
					className="h-4 w-5 rounded-[6px] border-yellow-500"
					flagCode={flagCode}
				/>
			</>
		),
		text
	);
	return element({});
};

export const WinLossIndicator = ({ win }: { win: boolean }) => {
	const element = createIndicatorBadge(
		win ? "bg-green-200" : "bg-red-200",
		win ? "text-green-800" : "text-red-800",
		win ? "border-green-500" : "border-red-500",
		() => (
			<div className="text-sm leading-none w-3 h-3 flex flex-row items-center justify-center">
				{win ? "W" : "L"}
			</div>
		)
	);
	return element({});
};

export const ScoreIndicator = ({
	win,
	score,
}: {
	win: boolean;
	score: string;
}) => {
	const element = createIndicatorBadge(
		win ? "w-full bg-green-200" : "w-full bg-red-200",
		win ? "text-green-800" : "text-red-800",
		win ? "border-green-500" : "border-red-500",
		() => (
			<p className="text-sm leading-none font-extrabold  w-full text-center">
				{score}
			</p>
		)
	);
	return element({});
};
