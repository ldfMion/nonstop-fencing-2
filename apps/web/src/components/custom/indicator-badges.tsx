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
	(color: string, Icon: FC<{ className: string }>, tooltip?: string): FC =>
	(): JSX.Element => {
		const badge = (
			<Badge
				className={`self-center rounded-sm p-1.5 bg-${color}-400/70`}
				variant="secondary"
			>
				{<Icon className={`text-${color}-800`} />}
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
	"purple",
	Network,
	"The tableau for this event is available."
);
