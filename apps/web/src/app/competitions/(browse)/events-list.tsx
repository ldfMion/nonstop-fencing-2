import { format } from "date-fns";
import { CompetitionCard } from "./competition-card";
import { Fragment } from "react";
import { Competition } from "~/lib/models";

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
		return Array.from(grouped.entries());
	};

	return (
		<>
			{groupCompetitionsByMonth(competitions).map(
				([month, monthCompetitions]) => (
					<Fragment key={month}>
						<h3 className="text-xl font-semibold px-4 mt-4 mb-2">
							{month}
						</h3>
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
