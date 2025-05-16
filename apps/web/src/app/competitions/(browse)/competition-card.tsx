import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Competition } from "~/models";
import { getDateRange } from "~/lib/utils";
import Link from "next/link";
import { Flag } from "~/components/custom/flag";

export function CompetitionCard({ competition }: { competition: Competition }) {
	return (
		<Link href={`/competitions/${competition.id}`}>
			<Card
				key={competition.id}
				className="mb-2 shadow-none rounded-3xl flex flex-col gap-2"
			>
				<CardHeader className="flex flex-row gap-2 items-center">
					<Flag
						flagCode={competition.flag}
						className="flex-shrink-0 w-12 h-8 rounded-[8px]"
					/>
					<div className="flex flex-col">
						<CardTitle className="text-md font-semibold leading-none">
							{competition.name}
						</CardTitle>
						<CardDescription className="text-sm">
							{getDateRange(competition.date)}
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="">
					<Badges competition={competition} />
				</CardContent>
			</Card>
		</Link>
	);
}

function Badges({ competition }: { competition: Competition }) {
	if (
		competition.weapons.length == 3 &&
		competition.genders.length == 2 &&
		competition.types.length == 2
	) {
		return <Badge variant="secondary">All Events</Badge>;
	}
	return (
		<div className="flex flex-row flex-wrap gap-2">
			{competition.genders.map(gender => (
				<Badge key={gender} className={getGenderColor(gender)}>
					{gender}
				</Badge>
			))}
			{competition.weapons.map(weapon => (
				<Badge key={weapon} className={getWeaponColor(weapon)}>
					{weapon}
				</Badge>
			))}
			{competition.types.map(type => (
				<Badge key={type} className={getTypeColor(type)}>
					{type}
				</Badge>
			))}
		</div>
	);
}

// Get weapon color based on weapon type
const getWeaponColor = (weapon: "FOIL" | "EPEE" | "SABER") => {
	switch (weapon) {
		case "FOIL":
			return "bg-blue-100 text-blue-800 ";
		case "EPEE":
			return "bg-green-100 text-green-800 ";
		case "SABER":
			return "bg-amber-100 text-amber-800 ";
		default:
			return "bg-gray-100 text-gray-800 ";
	}
};

// Get gender color
const getGenderColor = (gender: "MEN" | "WOMEN") => {
	return gender === "MEN"
		? "bg-purple-100 text-purple-800 "
		: "bg-orange-200 text-orange-800 ";
};

// Get type color
const getTypeColor = (type: "INDIVIDUAL" | "TEAM") => {
	return type === "INDIVIDUAL"
		? "bg-slate-100 text-slate-800 "
		: "bg-indigo-100 text-indigo-800 ";
};
