import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getRankingsOverview } from "./queries";
import { RankingData, RankingTable } from "./ranking-table";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 86400;

export default async function () {
	const {
		mensFoilIndividual,
		mensEpeeIndividual,
		mensSaberIndividual,
		womensFoilIndividual,
		womensEpeeIndividual,
		womensSaberIndividual,
		mensFoilTeam,
		mensEpeeTeam,
		mensSaberTeam,
		womensFoilTeam,
		womensEpeeTeam,
		womensSaberTeam,
	} = await getRankingsOverview(2025);
	return (
		<main className="p-4 max-w-5xl mx-auto flex flex-col gap-3">
			<div className="">
				<h1 className="text-3xl font-bold mb-2">FIE World Rankings</h1>
			</div>
			<h2 className="text-2xl font-bold">Men's Individual</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard
					data={mensFoilIndividual}
					title="Foil"
					link="/mens/foil/individual"
				/>
				<RankingCard
					data={mensEpeeIndividual}
					title="Epee"
					link="/mens/epee/individual"
				/>
				<RankingCard
					data={mensSaberIndividual}
					title="Saber"
					link="/mens/saber/individual"
				/>
			</div>
			<h2 className="text-2xl font-bold">Women's Individual</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard
					data={womensFoilIndividual}
					title="Foil"
					link="/womens/foil/individual"
				/>
				<RankingCard
					data={womensEpeeIndividual}
					title="Epee"
					link="/womens/epee/individual"
				/>
				<RankingCard
					data={womensSaberIndividual}
					title="Saber"
					link="/womens/saber/individual"
				/>
			</div>
			<h2 className="text-2xl font-bold">Men's Teams</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard
					data={mensFoilTeam}
					title="Men's Foil Team"
					link="/mens/foil/team"
				/>

				<RankingCard
					data={mensEpeeTeam}
					title="Men's Epee Team"
					link="/mens/epee/team"
				/>
				<RankingCard
					data={mensSaberTeam}
					title="Men's Saber Team"
					link="/mens/saber/team"
				/>
			</div>
			<h2 className="text-2xl font-bold">Women's Teams</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard
					data={womensFoilTeam}
					title="Women's Foil Team"
					link="/womens/foil/team"
				/>
				<RankingCard
					data={womensEpeeTeam}
					title="Women's Epee Team"
					link="/womens/epee/team"
				/>

				<RankingCard
					data={womensSaberTeam}
					title="Women's Saber Team"
					link="/womens/saber/team"
				/>
			</div>
		</main>
	);
}

function RankingCard({
	data,
	title,
	link,
}: {
	data: RankingData[];
	title: string;
	link: string;
}) {
	return (
		<Card className="p-0 gap-0 overflow-clip max-w-md w-full">
			<Link href={"/rankings" + link} className="block">
				<CardHeader className="p-4 bg-muted hover:bg-accent transition-colors gap-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<CardTitle className="text-lg font-bold">
								{title}
							</CardTitle>
						</div>
						<ChevronRight className="w-5 h-5" />
					</div>
				</CardHeader>
			</Link>

			<CardContent className="p-0">
				<RankingTable
					data={data}
					showHeader={false}
					showPoints={false}
				/>
			</CardContent>
		</Card>
	);
}
