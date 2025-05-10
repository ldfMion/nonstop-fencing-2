import { format } from "date-fns";
import { CompetitionCard } from "./competition-card";
import { Fragment } from "react";

export type Competition = {
	id: number;
	name: string;
	flag?: string;
	weapons: ("FOIL" | "EPEE" | "SABER")[];
	types: ("INDIVIDUAL" | "TEAM")[];
	genders: ("MEN" | "WOMEN")[];
	date: {
		start: Date;
		end: Date;
	};
};

export type Event = {
	id: number;
	date: Date;
};

export function EventsList({ competitions }: { competitions: Competition[] }) {
	if (competitions.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					No events found matching your filters.
				</p>
			</div>
		);
	}

	competitions.sort(
		(b, a) => a.date.start.getTime() - b.date.start.getTime()
	);

	const groupCompetitionsByMonth = (competitions: Competition[]) => {
		const grouped = new Map<string, Competition[]>();
		competitions.forEach(competition => {
			const monthKey = format(
				new Date(competition.date.start),
				"MMMM yyyy"
			);
			const existing = grouped.get(monthKey) || [];
			grouped.set(monthKey, [...existing, competition]);
		});

		// Create array of entries and sort by actual date, not string
		return Array.from(grouped.entries()).sort((a, b) => {
			const aDate = new Date(a[0]); // Parse the "Month YYYY" string
			const bDate = new Date(b[0]);
			return bDate.getTime() - aDate.getTime();
		});
	};

	return (
		<>
			{groupCompetitionsByMonth(competitions).map(
				([month, monthCompetitions]) => (
					<Fragment key={month}>
						<h2 className="text-xl font-semibold px-4 mt-4 mb-2">
							{month}
						</h2>
						{monthCompetitions.map(competition => (
							<CompetitionCard
								key={competition.id}
								competition={competition}
							/>
						))}
					</Fragment>
				)
			)}
		</>
	);
}
