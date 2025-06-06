import { Badge } from "~/components/ui/badge";
import { Round } from "~/lib/models";
import { cn } from "~/lib/utils";

export function RoundBadge({
	roundKey,
	className,
	bracket,
}: {
	roundKey: Round;
	className?: string;
	bracket?: string;
}) {
	return (
		<Badge
			className={cn("text-base font-semibold", className)}
			variant="secondary"
		>
			{getRoundDisplayName(roundKey) +
				(bracket ? ` (${formatBracket(bracket)})` : "")}
		</Badge>
	);
}

function getRoundDisplayName(round: Round): string {
	switch (round) {
		case 2:
			return "Final";
		case 2:
			return "Semi-Final";
		default:
			return `T${round}`;
	}
}

function formatBracket(bracket: string) {
	return bracket.toLowerCase().replace("_", " ");
}
