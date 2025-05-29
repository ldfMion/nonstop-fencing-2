import {
	competitionsWithFlag,
	competitionsWithFlagsAndEvents,
	events,
	fencers,
	liveBouts,
	pastBouts,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { sql, eq, inArray, and } from "drizzle-orm";
import { EventModel, NewLiveBoutModel, NewPastBoutModel } from "~/lib/models";

export async function insertFencers(
	newFencers: {
		firstName: string;
		lastName: string;
		country: string;
		gender: "MEN" | "WOMEN";
	}[]
) {
	console.log("inserting fencers", newFencers.length);
	console.log(
		await db.transaction(tx =>
			tx
				.insert(fencers)
				.values(newFencers)
				.onConflictDoNothing({
					target: [
						fencers.firstName,
						fencers.lastName,
						fencers.country,
					],
				})
		)
	);
}

export async function getFencers(filters: {
	firstName: string[];
	lastName?: string[];
}) {
	return await db
		.select()
		.from(fencers)
		.where(
			and(
				filters.firstName
					? inArray(fencers.firstName, filters.firstName)
					: undefined,
				filters.lastName
					? inArray(fencers.lastName, filters.lastName)
					: undefined
			)
		);
}

export async function updateEvent(event: EventModel, set: Partial<EventModel>) {
	console.log(
		await db.update(events).set(set).where(eq(events.id, event.id))
	);
	console.log("updating materialized views");
	await db.refreshMaterializedView(competitionsWithFlag);
	await db.refreshMaterializedView(competitionsWithFlagsAndEvents);
}

export async function insertLiveBouts(bouts: NewLiveBoutModel[]) {
	if (bouts.length == 0) {
		return;
	}
	console.log("inserting live bouts");
	console.log(
		await db.transaction(tx =>
			tx
				.insert(liveBouts)
				.values(bouts)
				.onConflictDoUpdate({
					set: {
						fencerA: sql`EXCLUDED.fencer_a`,
						fencerB: sql`EXCLUDED.fencer_b`,
						fencerAScore: sql`EXCLUDED.fencer_a_score`,
						fencerBScore: sql`EXCLUDED.fencer_b_score`,
						winnerIsA: sql`EXCLUDED.winner_is_a`,
					},
					target: [liveBouts.event, liveBouts.order, liveBouts.round],
				})
		)
	);
}

export async function insertPastBoutsAndUpdateEvent(
	bouts: NewPastBoutModel[],
	eventId: number
) {
	console.log("inserting past bouts", bouts.length);
	if (bouts.length == 0) {
		return;
	}
	await db.transaction(async tx => {
		await tx.insert(pastBouts).values(bouts);
		await db
			.update(events)
			.set({ hasResults: true, hasFieResults: true })
			.where(eq(events.id, eventId));
		await db.refreshMaterializedView(competitionsWithFlagsAndEvents);
	});
}
