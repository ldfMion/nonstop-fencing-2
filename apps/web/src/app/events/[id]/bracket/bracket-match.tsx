import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { MatchCard } from "./match-card";
import { JSX } from "react";

type Entity = {
	primaryName: string;
	secondaryName: string;
	score?: number;
	flag?: string;
};

export function BracketMatch({
	match,
	hidden,
	details,
}: {
	match: {
		top?: Entity;
		bottom?: Entity;
		winnerIsA?: boolean;
	};
	hidden: boolean;
	details?: JSX.Element;
}) {
	if (!details) {
		return <MatchCard match={match} hidden={hidden} info={false} />;
	}
	return (
		<Dialog>
			<DialogTrigger className="transition-all duration-100 ease-in">
				<MatchCard match={match} hidden={hidden} info={true} />
			</DialogTrigger>
			<DialogContent>{details}</DialogContent>
		</Dialog>
	);
}
