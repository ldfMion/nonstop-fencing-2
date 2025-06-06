import { eq, and, asc, or, desc, sql, aliasedTable } from "drizzle-orm";
import { db } from "~/infra/db";
import {
	competitionsWithFlagsAndEvents,
	countries,
	fencers,
	individualSeasonRankings,
	pastBouts,
} from "~/infra/db/schema";

export async function getFencer(id: number) {
	return (
		await db
			.select({
				id: fencers.id,
				firstName: fencers.firstName,
				lastName: fencers.lastName,
				flag: countries.isoCode,
				rank: individualSeasonRankings.position,
				weapon: individualSeasonRankings.weapon,
				gender: individualSeasonRankings.gender,
			})
			.from(fencers)
			.where(eq(fencers.id, id))
			.innerJoin(countries, eq(fencers.country, countries.iocCode))
			.leftJoin(
				individualSeasonRankings,
				eq(fencers.id, individualSeasonRankings.fencer)
			)
			.orderBy(asc(individualSeasonRankings.position))
			.limit(1)
	)[0];
}

export async function getEventsWithFencerBouts(
	fencerId: number,
	season: number
) {
	const boutsWithEvents = await db
		.select({
			id: pastBouts.id,
			opponent: {
				id: fencers.id,
				firstName: fencers.firstName,
				lastName: fencers.lastName,
				flag: countries.isoCode,
			},
			scoreA: pastBouts.fencerAScore,
			scoreB: pastBouts.fencerBScore,
			event: {
				id: competitionsWithFlagsAndEvents.eventId,
				date: competitionsWithFlagsAndEvents.date,
				name: competitionsWithFlagsAndEvents.name,
				flag: competitionsWithFlagsAndEvents.flag,
			},
			round: pastBouts.round,
			won: sql<boolean>`(${pastBouts.fencerA} = ${fencerId} AND ${pastBouts.winnerIsA}) OR (${pastBouts.fencerB} = ${fencerId} AND NOT ${pastBouts.winnerIsA})`.as(
				"won"
			),
		})
		.from(pastBouts)
		.innerJoin(
			competitionsWithFlagsAndEvents,
			eq(pastBouts.event, competitionsWithFlagsAndEvents.eventId)
		)
		.innerJoin(
			fencers,
			or(
				and(
					eq(pastBouts.fencerA, fencerId),
					eq(pastBouts.fencerB, fencers.id)
				),
				and(
					eq(pastBouts.fencerB, fencerId),
					eq(pastBouts.fencerA, fencers.id)
				)
			)
		)
		.innerJoin(countries, eq(fencers.country, countries.iocCode))
		.where(
			and(
				eq(competitionsWithFlagsAndEvents.season, season),
				or(
					eq(pastBouts.fencerA, fencerId),
					eq(pastBouts.fencerB, fencerId)
				)
			)
		)
		.orderBy(
			desc(competitionsWithFlagsAndEvents.date),
			asc(pastBouts.round)
		);
	const eventsWithBouts = Array.from(
		new Set(boutsWithEvents.map(b => b.event.id)),
		id => {
			const event = boutsWithEvents.find(b => b.event.id === id)!.event;
			return {
				id,
				date: event.date,
				name: event.name,
				flag: event.flag,
				bouts: boutsWithEvents.filter(b => b.event.id === id),
			};
		}
	);

	return eventsWithBouts;
}

export function getAllFencers() {
	return db.select({ id: fencers.id }).from(fencers);
}
