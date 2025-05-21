"use server";
import {
	competitions,
	countries,
	events,
	fencers,
	liveBouts,
	pastBouts,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { eq, and, desc, aliasedTable, or } from "drizzle-orm";
import { LiveBoutModel, PastBoutModel } from "~/lib/models";

export async function getBoutsBetweenFencers(fencerA: number, fencerB: number) {
	const fencers2 = aliasedTable(fencers, "fencers2");
	const countries2 = aliasedTable(countries, "countries2");
	return (
		await db
			.select({
				id: pastBouts.id,
				fencerA: {
					id: fencers.id,
					firstName: fencers.firstName,
					lastName: fencers.lastName,
					score: pastBouts.fencerAScore,
					flag: countries.isoCode,
				},
				fencerB: {
					id: fencers2.id,
					firstName: fencers2.firstName,
					lastName: fencers2.lastName,
					score: pastBouts.fencerBScore,
					flag: countries2.isoCode,
				},
				round: pastBouts.round,
				order: pastBouts.order,
				winnerIsA: pastBouts.winnerIsA,
				competition: competitions.name,
				event: {
					id: events.id,
					date: events.date,
				},
			})
			.from(pastBouts)
			.where(
				or(
					and(
						eq(pastBouts.fencerA, fencerA),
						eq(pastBouts.fencerB, fencerB)
					),
					and(
						eq(pastBouts.fencerA, fencerB),
						eq(pastBouts.fencerB, fencerA)
					)
				)
			)
			.leftJoin(fencers, eq(pastBouts.fencerA, fencers.id))
			.leftJoin(fencers2, eq(pastBouts.fencerB, fencers2.id))
			.leftJoin(countries, eq(fencers.country, countries.iocCode))
			.leftJoin(countries2, eq(fencers2.country, countries2.iocCode))
			.leftJoin(events, eq(events.id, pastBouts.event))
			.leftJoin(competitions, eq(events.competition, competitions.id))
			.orderBy(desc(events.date))
	).map(b => ({
		fencerA: {
			id: b.fencerA.id!,
			firstName: b.fencerA.firstName!,
			lastName: b.fencerA.lastName!,
			score: b.fencerA.score ?? undefined,
			flag: b.fencerA.flag ?? undefined,
		},
		fencerB: {
			id: b.fencerB.id!,
			firstName: b.fencerB.firstName!,
			lastName: b.fencerB.lastName!,
			score: b.fencerB.score ?? undefined,
			flag: b.fencerB.flag ?? undefined,
		},
		round: b.round,
		order: b.order,
		winnerIsA: b.winnerIsA,
		id: b.id,
		competition: b.competition!,
		event: {
			date: b.event!.date!,
			id: b.event!.id!,
		},
	}));
}

export async function getPastTableau(
	eventId: number
): Promise<PastBoutModel[]> {
	const fencers2 = aliasedTable(fencers, "fencers2");
	const countries2 = aliasedTable(countries, "countries2");
	return (
		await db
			.select({
				id: pastBouts.id,
				fencerA: {
					id: fencers.id,
					firstName: fencers.firstName,
					lastName: fencers.lastName,
					score: pastBouts.fencerAScore,
					flag: countries.isoCode,
				},
				fencerB: {
					id: fencers2.id,
					firstName: fencers2.firstName,
					lastName: fencers2.lastName,
					score: pastBouts.fencerBScore,
					flag: countries2.isoCode,
				},
				round: pastBouts.round,
				order: pastBouts.order,
				winnerIsA: pastBouts.winnerIsA,
			})
			.from(pastBouts)
			.where(eq(pastBouts.event, eventId))
			.orderBy(desc(pastBouts.round), pastBouts.order)
			.leftJoin(fencers, eq(pastBouts.fencerA, fencers.id))
			.leftJoin(fencers2, eq(pastBouts.fencerB, fencers2.id))
			.leftJoin(countries, eq(fencers.country, countries.iocCode))
			.leftJoin(countries2, eq(fencers2.country, countries2.iocCode))
	).map(b => ({
		fencerA: {
			id: b.fencerA.id!,
			firstName: b.fencerA.firstName!,
			lastName: b.fencerA.lastName!,
			score: b.fencerA.score ?? undefined,
			flag: b.fencerA.flag ?? undefined,
		},
		fencerB: {
			id: b.fencerB.id!,
			firstName: b.fencerB.firstName!,
			lastName: b.fencerB.lastName!,
			score: b.fencerB.score ?? undefined,
			flag: b.fencerB.flag ?? undefined,
		},
		round: b.round,
		order: b.order,
		winnerIsA: b.winnerIsA,
		id: b.id,
	}));
}

export async function getLiveTableau(
	eventId: number
): Promise<LiveBoutModel[]> {
	const fencers2 = aliasedTable(fencers, "fencers2");
	const countries2 = aliasedTable(countries, "countries2");
	return (
		await db
			.select({
				id: liveBouts.id,
				fencerA: {
					id: fencers.id,
					firstName: fencers.firstName,
					lastName: fencers.lastName,
					score: liveBouts.fencerAScore,
					flag: countries.isoCode,
				},
				fencerB: {
					id: fencers2.id,
					firstName: fencers2.firstName,
					lastName: fencers2.lastName,
					score: liveBouts.fencerBScore,
					flag: countries2.isoCode,
				},
				round: liveBouts.round,
				order: liveBouts.order,
				winnerIsA: liveBouts.winnerIsA,
			})
			.from(liveBouts)
			.where(eq(liveBouts.event, eventId))
			.orderBy(desc(liveBouts.round), liveBouts.order)
			.leftJoin(fencers, eq(liveBouts.fencerA, fencers.id))
			.leftJoin(fencers2, eq(liveBouts.fencerB, fencers2.id))
			.leftJoin(countries, eq(fencers.country, countries.iocCode))
			.leftJoin(countries2, eq(fencers2.country, countries2.iocCode))
	).map(b => ({
		fencerA: b.fencerA.firstName
			? {
					id: b.fencerA.id!,
					firstName: b.fencerA.firstName!,
					lastName: b.fencerA.lastName!,
					score: b.fencerA.score ?? undefined,
					flag: b.fencerA.flag ?? undefined,
			  }
			: undefined,
		fencerB: b.fencerB.firstName
			? {
					id: b.fencerB.id!,
					firstName: b.fencerB.firstName!,
					lastName: b.fencerB.lastName!,
					score: b.fencerB.score ?? undefined,
					flag: b.fencerB.flag ?? undefined,
			  }
			: undefined,
		round: b.round,
		order: b.order,
		winnerIsA: b.winnerIsA ?? undefined,
		id: b.id,
	}));
}
