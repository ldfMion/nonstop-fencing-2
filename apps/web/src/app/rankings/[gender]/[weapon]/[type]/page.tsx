import { getRankingsForWeaponAndGender } from "~/app/rankings/queries";

export default async function WeaponGenderRankingsPage({
	params,
}: {
	params: Promise<{ weapon: string; gender: string; type: string }>;
}) {
	const { weapon, gender, type } = parseParams(await params);
	const data = await getRankingsForWeaponAndGender(weapon, gender, 2025);
	return JSON.stringify(data);
}

function parseParams(params: { weapon: string; gender: string; type: string }) {
	return {
		weapon: weaponMap[params.weapon],
		gender: genderMap[params.gender],
		type: typeMap[params.type],
	};
}

const weaponMap: Record<string, "FOIL" | "EPEE" | "SABER"> = {
	foil: "FOIL",
	epee: "EPEE",
	saber: "SABER",
};

const genderMap: Record<string, "MEN" | "WOMEN"> = {
	mens: "MEN",
	womens: "WOMEN",
};

const typeMap: Record<string, "INDIVIDUAL" | "TEAM"> = {
	individual: "INDIVIDUAL",
	team: "TEAM",
};
