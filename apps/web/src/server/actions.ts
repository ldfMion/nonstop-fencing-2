"use server";

import { QUERIES } from "./db/queries";

export async function getHeadToHeadBouts(fencerA: number, fencerB: number) {
	return QUERIES.getBoutsBetweenFencers(fencerA, fencerB);
}
