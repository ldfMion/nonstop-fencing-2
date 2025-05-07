import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "~/components/ui/card";

type Competition = {
	id: number;
	name: string;
	events: Event[];
	flag: string;
};

type Event = {
	id: number;
	date: Date;
	weapon: "FOIL" | "EPEE" | "SABER";
	type: "INDIVIDUAL" | "TEAM";
	gender: "MEN" | "WOMEN";
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
		(b, a) => a.events[0]!.date.getTime() - b.events[0]!.date.getTime()
	);

	const getEventDescription = (event: Event) => {
		const gender = event.gender === "MEN" ? "Men's" : "Women's";
		const weapon =
			event.weapon.charAt(0) + event.weapon.slice(1).toLowerCase();
		const type = event.type.charAt(0) + event.type.slice(1).toLowerCase();
		return `${gender} ${weapon} ${type}`;
	};

	const groupCompetitionsByMonth = (competitions: Competition[]) => {
		const grouped = new Map<string, Competition[]>();
		competitions.forEach(competition => {
			const earliestDate = Math.min(
				...competition.events.map(e => new Date(e.date).getTime())
			);
			const monthKey = format(new Date(earliestDate), "MMMM yyyy");
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

	const getCompetitionDateRange = (events: Event[]) => {
		const dates = events.map(e => new Date(e.date).getTime());
		const startDate = new Date(Math.min(...dates));
		const endDate = new Date(Math.max(...dates));
		return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
	};

	return (
		<div className="flex flex-col gap-8">
			{groupCompetitionsByMonth(competitions).map(
				([month, monthCompetitions]) => (
					<div key={month} className="space-y-6">
						<h2 className="text-xl font-semibold px-4">{month}</h2>
						{monthCompetitions.map(competition => (
							<Card key={competition.id} className="relative">
								<CardContent className="pt-6">
									<div className="flex items-start gap-4 mb-4">
										<div className="flex-shrink-0 w-12 h-8 overflow-hidden rounded-md border">
											<Image
												src={`https://flagcdn.com/w1280/${competition.flag.toLowerCase()}.png`}
												alt={`${competition.flag} flag`}
												className="w-full h-full object-cover"
												height={400}
												width={400}
											/>
										</div>
										<div className="flex flex-col">
											<CardTitle className="text-xl font-semibold">
												{competition.name}
											</CardTitle>
											<CardDescription>
												{getCompetitionDateRange(
													competition.events
												)}
											</CardDescription>
										</div>
									</div>

									<div className="ml-6 mt-6 border-l-2 border-gray-200">
										{competition.events
											.sort(
												(a, b) =>
													new Date(a.date).getTime() -
													new Date(b.date).getTime()
											)
											.map(event => (
												<div
													key={event.id}
													className="relative pl-6 pb-6 last:pb-0"
												>
													<div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-gray-400" />
													<div className="flex flex-row items-center gap-1">
														<div className="text-sm font-medium">
															{format(
																new Date(
																	event.date
																),
																"MMMM d"
															)}
														</div>
														<div className="text-md font-bold">
															{getEventDescription(
																event
															)}
														</div>
													</div>
												</div>
											))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)
			)}
		</div>
	);
}
