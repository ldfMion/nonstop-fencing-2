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
import type { DBEventInput as Event } from "~/server/db/queries";

export function EventsList({
	events,
}: {
	events: (Event & { flag: string })[];
}) {
	if (events.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					No events found matching your filters.
				</p>
			</div>
		);
	}

	// Group events by month
	const groupedEvents = events.reduce(
		(groups, event) => {
			const monthYear = format(new Date(event.date), "MMMM yyyy");
			if (!groups[monthYear]) {
				groups[monthYear] = [];
			}
			groups[monthYear].push(event);
			return groups;
		},
		{} as Record<string, (Event & { flag: string })[]>
	);

	// Get weapon color based on weapon type
	const getWeaponColor = (weapon: "FOIL" | "EPEE" | "SABER") => {
		switch (weapon) {
			case "FOIL":
				return "bg-blue-100 text-blue-800 hover:bg-blue-200";
			case "EPEE":
				return "bg-green-100 text-green-800 hover:bg-green-200";
			case "SABER":
				return "bg-amber-100 text-amber-800 hover:bg-amber-200";
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200";
		}
	};

	// Get gender color
	const getGenderColor = (gender: "MEN" | "WOMEN") => {
		return gender === "MEN"
			? "bg-purple-100 text-purple-800 hover:bg-purple-200"
			: "bg-pink-100 text-pink-800 hover:bg-pink-200";
	};

	// Get type color
	const getTypeColor = (type: "INDIVIDUAL" | "TEAM") => {
		return type === "INDIVIDUAL"
			? "bg-slate-100 text-slate-800 hover:bg-slate-200"
			: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
	};

	return Object.entries(groupedEvents).map(([month, monthEvents]) => (
		<div key={month} className="flex flex-col">
			<h2 className="text-xl font-semibold mb-4 px-4">{month}</h2>
			<div className="overflow-hidden gap-2 flex flex-col">
				{monthEvents.map((event, index) => (
					<Card key={event.id}>
						<CardContent className="flex flex-col gap-1">
							<div className="flex flex-col">
								<div className="flex flex-row gap-2">
									<div className="flex-shrink-0 w-10 h-7 overflow-hidden rounded-md border">
										<Image
											src={`https://flagcdn.com/w1280/${event.flag.toLowerCase()}.png`}
											alt={`${event.flag} flag`}
											className="w-full h-full object-cover"
											height={400}
											width={400}
										/>
									</div>
									<CardTitle className="text-lg font-medium text-gray-900">
										{event.name}
									</CardTitle>
								</div>
								<CardDescription className="text-sm text-gray-500 mt-1">
									{format(new Date(event.date), "MMM d")} -{" "}
									{format(
										new Date(
											new Date(event.date).getTime() +
												3 * 24 * 60 * 60 * 1000
										),
										"MMM d, yyyy"
									)}
								</CardDescription>
							</div>
							<div className="flex items-center space-x-2">
								<Badge
									className={`font-medium ${getGenderColor(event.gender)}`}
									variant="outline"
								>
									{event.gender === "MEN"
										? "Men's"
										: "Women's"}
								</Badge>
								<Badge
									className={`font-medium ${getWeaponColor(event.weapon)}`}
									variant="outline"
								>
									{event.weapon.charAt(0) +
										event.weapon.slice(1).toLowerCase()}
								</Badge>
								<Badge
									className={`font-medium ${getTypeColor(event.type)}`}
									variant="outline"
								>
									{event.type.charAt(0) +
										event.type.slice(1).toLowerCase()}
								</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	));
}

/*
											<Image
												src={`https://flagcdn.com/w80/${event.countryCode.toLowerCase()}.png`}
												alt={`${event.countryCode} flag`}
												className="w-full h-full object-cover"
												width={20}
												height={20}
												// onError={e => {
												// 	(
												// 		e.target as HTMLImageElement
												// 	).src =
												// 		"/placeholder.svg?height=24&width=32";
												// }}
											/>
                                            */
