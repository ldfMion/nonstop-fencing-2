import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import assert from "assert";
import type { BracketMatch } from "~/lib/models";
import { HeadToHead } from "./head-to-head";
import { BoutCard } from "./bout-card";

export function Bout({
	bout,
	hidden,
}: {
	bout: BracketMatch;
	hidden: boolean;
}) {
	const fencerA = "fencerA" in bout ? bout.fencerA : undefined;
	const fencerB = "fencerB" in bout ? bout.fencerB : undefined;
	// console.log(fencerA, fencerB, hidden);
	if (!fencerA || !fencerB) {
		return <BoutCard bout={bout} hidden={hidden} info={false} />;
	}
	assert(bout.id);
	return (
		<Dialog>
			<DialogTrigger className="transition-all duration-100 ease-in">
				<BoutCard bout={bout} hidden={hidden} info={true} />
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Head-to-head</DialogTitle>
				<HeadToHead
					boutId={bout.id}
					fencerA={fencerA}
					fencerB={fencerB}
				/>
				<p className="text-xs">Only 24-25 season included.</p>
			</DialogContent>
		</Dialog>
	);
}
