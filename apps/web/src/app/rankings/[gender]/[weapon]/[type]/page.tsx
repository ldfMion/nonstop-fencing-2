import { Metadata } from "next";
import {
	getIndividualRankingsForWeaponAndGender,
	getTeamRankings,
} from "~/app/rankings/queries";
import { RankingTable } from "~/app/rankings/ranking-table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { toTitleCase } from "~/lib/utils";

const NUM_FENCERS_IN_PAGE = 70;
const NUM_TEAMS_IN_PAGE = 40;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ weapon: string; gender: string; type: string }>;
}): Promise<Metadata> {
	const { weapon, gender, type } = parseParams(await params);
	return {
		title: toTitleCase(`${gender}'s ${weapon} ${type}`) + " Rankings",
		description: `FIE World Rankings for ${weapon} ${gender} ${type}`,
	};
}

export const revalidate = 86400;

const WEAPONS = ["FOIL", "EPEE", "SABER"] as const;
const GENDERS = ["MEN", "WOMEN"] as const;
const TYPES = ["INDIVIDUAL", "TEAM"] as const;

export function generateStaticParams() {
	return GENDERS.flatMap(gender =>
		WEAPONS.flatMap(weapon =>
			TYPES.map(type => ({
				weapon: weapon.toLowerCase(),
				gender: gender.toLowerCase() + "s",
				type: type.toLowerCase(),
			}))
		)
	);
}

export default async function WeaponGenderRankingsPage({
	params,
}: {
	params: Promise<{ weapon: string; gender: string; type: string }>;
}) {
	const { weapon, gender, type } = parseParams(await params);
	const data =
		type == "INDIVIDUAL"
			? await getIndividualRankingsForWeaponAndGender(
					weapon,
					gender,
					2025,
					NUM_FENCERS_IN_PAGE
			  )
			: await getTeamRankings(weapon, gender, 2025, NUM_TEAMS_IN_PAGE);
	return (
		<main className="p-4 max-w-4xl mx-auto flex flex-col gap-4">
			<Card className="p-0 gap-0 overflow-clip">
				<CardHeader className="p-6 gap-2 flex flex-row items-center bg-muted pb-2">
					<CardTitle className="text-2xl font-bold capitalize">
						{`${gender}'s ${weapon} ${type}`.toLowerCase()}
					</CardTitle>
				</CardHeader>
				<CardContent className="">
					<RankingTable data={data} showHeader showPoints />
				</CardContent>
			</Card>
		</main>
	);
}

function parseParams(params: { weapon: string; gender: string; type: string }) {
	return {
		weapon: weaponMap[params.weapon],
		gender: genderMap[params.gender],
		type: typeMap[params.type],
	};
}

const weaponMap: Record<string, (typeof WEAPONS)[number]> = {
	foil: "FOIL",
	epee: "EPEE",
	saber: "SABER",
};

const genderMap: Record<string, (typeof GENDERS)[number]> = {
	mens: "MEN",
	womens: "WOMEN",
};

const typeMap: Record<string, (typeof TYPES)[number]> = {
	individual: "INDIVIDUAL",
	team: "TEAM",
};
