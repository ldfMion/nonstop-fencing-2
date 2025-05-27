import { FC, JSX } from "react";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/utils";
import { Network } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

const createIndicatorBadge =
	(
		bgColor: string,
		textColor: string,
		Icon: FC<{ className: string }>,
		tooltip?: string
	): FC =>
	(): JSX.Element => {
		const badge = (
			<Badge
				className={cn("self-center rounded-sm p-1.5", bgColor)}
				variant="secondary"
			>
				<Icon className={textColor} />
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
	Network,
	"The tableau for this event is available."
);
