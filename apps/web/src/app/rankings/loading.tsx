import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
export default function RankingLoading() {
	return (
		<main className="p-4 max-w-6xl mx-auto flex flex-col gap-3">
			<div className="">
				<h1 className="text-3xl font-bold mb-2">World Rankings</h1>
			</div>
			<h2 className="text-2xl font-bold">Men's Individual</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard title="Foil" link="/mens/foil/individual" />
				<RankingCard title="Epee" link="/mens/epee/individual" />
				<RankingCard title="Saber" link="/mens/saber/individual" />
			</div>
			<h2 className="text-2xl font-bold">Women's Individual</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard title="Foil" link="/womens/foil/individual" />
				<RankingCard title="Epee" link="/womens/epee/individual" />
				<RankingCard title="Saber" link="/womens/saber/individual" />
			</div>
			<h2 className="text-2xl font-bold">Men's Teams</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard title="Men's Foil Team" link="/mens/foil/team" />

				<RankingCard title="Men's Epee Team" link="/mens/epee/team" />
				<RankingCard title="Men's Saber Team" link="/mens/saber/team" />
			</div>
			<h2 className="text-2xl font-bold">Women's Teams</h2>
			<div className="flex flex-col gap-4 md:flex-row items-center md:items-start">
				<RankingCard
					title="Women's Foil Team"
					link="/womens/foil/team"
				/>
				<RankingCard
					title="Women's Epee Team"
					link="/womens/epee/team"
				/>

				<RankingCard
					title="Women's Saber Team"
					link="/womens/saber/team"
				/>
			</div>
		</main>
	);
}

function RankingCard({ title, link }: { title: string; link: string }) {
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
				{new Array(3).fill(null).map((_, i) => (
					<Skeleton
						className="h-12 border-t-2 rounded-none"
						key={i}
					/>
				))}
			</CardContent>
		</Card>
	);
}
