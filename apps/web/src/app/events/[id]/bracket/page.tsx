import { QUERIES } from "~/server/db/queries";

export default async function BracketPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const tableau = await QUERIES.getLiveTableau(Number(id));
	return <p>{JSON.stringify(tableau)}</p>;
}
