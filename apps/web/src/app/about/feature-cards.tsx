import { Trophy, Medal, Clock, Heart, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

type Feature = {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
	comingSoon?: boolean;
};

const features: Feature[] = [
	{
		icon: Trophy,
		title: "Browse Events",
		description:
			"Access a comprehensive database of fencing events including World Cups, World Championships, Grand Prix, and Zonal Championships.",
	},
	{
		icon: Clock,
		title: "Live Results",
		description:
			"Follow matches in real-time with our live scoring system, updated instantly as bouts progress.",
	},
	{
		icon: Medal,
		title: "Past Results",
		description:
			"Explore historical data from previous tournaments, including final standings and match details.",
	},
	{
		icon: Heart,
		title: "Favorites",
		description:
			"Personalized notifications for followed fencers, teams, and tournaments with quick access to live scores.",
		comingSoon: true,
	},
	{
		icon: BarChart3,
		title: "Rankings",
		description:
			"Official world rankings for individuals and teams with historical data and filtering options.",
		comingSoon: true,
	},
];

export function FeatureCards() {
	return (
		<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{features.map((feature, index) => (
				<Card
					key={index}
					className="bg-background/50 backdrop-blur-sm border-primary/10 overflow-hidden relative group hover:shadow-md transition-all duration-300 rounded-xl"
				>
					<CardHeader className="">
						<div className="flex flex-row justify-between">
							<feature.icon className="h-8 w-8 text-primary" />
							{feature.comingSoon && (
								<Badge className="" variant="outline">
									Coming Soon
								</Badge>
							)}
						</div>
						<CardTitle>{feature.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							{feature.description}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
