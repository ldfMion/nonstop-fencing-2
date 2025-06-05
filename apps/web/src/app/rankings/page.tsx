import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getRankingsOverview } from "./queries";
import { RankingData, RankingTable } from "./ranking-table";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { Separator } from "~/components/ui/separator";
import { CustomCard } from "~/components/custom/custom-card";

export const revalidate = 86400;

export const metadata: Metadata = {
	title: "Rankings | Nonstop Fencing",
	description: "FIE World Rankings",
};

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
				<h1 className="text-3xl font-bold mb-2">
					FIE Senior World Rankings
				</h1>
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
					title="Foil"
					link="/mens/foil/team"
				/>

				<RankingCard
					data={mensEpeeTeam}
					title="Epee"
					link="/mens/epee/team"
				/>
				<RankingCard
					data={mensSaberTeam}
					title="Saber"
					link="/mens/saber/team"
				/>
			</div>
			<h2 className="text-2xl font-bold">Women's Teams</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard
					data={womensFoilTeam}
					title="Foil"
					link="/womens/foil/team"
				/>
				<RankingCard
					data={womensEpeeTeam}
					title="Epee"
					link="/womens/epee/team"
				/>

				<RankingCard
					data={womensSaberTeam}
					title="Saber"
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
		<CustomCard
			link={"/rankings" + link}
			headerContent={
				<CardTitle className="text-lg font-bold">{title}</CardTitle>
			}
			content={
				<RankingTable
					data={data}
					showHeader={false}
					showPoints={false}
				/>
			}
		/>
	);
}
