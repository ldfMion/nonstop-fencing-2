import assert from "assert";
import { QUERIES } from "~/server/db/queries";

export default async function BoutPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const boutId = Number(id);
	assert(!isNaN(boutId), "Bout ID must be a number");
	const bout = await QUERIES.getBout(boutId);
	const pastBouts = await QUERIES.getBoutsBetweenFencers(
		bout.fencerA.id!,
		bout.fencerB.id!
	);
	console.log("bout", bout);
	console.log("bouts", pastBouts);
	return <p>Bout page</p>;
}
