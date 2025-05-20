import { Badge } from "~/components/ui/badge";
import { Round } from "~/lib/models";
import { cn } from "~/lib/utils";

export function RoundBadge({
	roundKey,
	className,
}: {
	roundKey: Round;
	className?: string;
}) {
	return (
		<Badge
			className={cn("text-base font-semibold", className)}
			variant="secondary"
		>
			{getRoundDisplayName(roundKey)}
		</Badge>
	);
}

function getRoundDisplayName(round: Round) {
	switch (round) {
		case "2":
			return "Final";
		case "4":
			return "Semi-Final";
		default:
			return `T${round}`;
	}
}
