import { QUERIES } from "~/server/db/queries";
import { Bracket } from "./bracket";

export default async function BracketPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const tableau = await QUERIES.getLiveTableau(Number(id));
	return <Bracket bouts={tableau} />;
}
