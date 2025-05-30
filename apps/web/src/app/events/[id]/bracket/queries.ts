"use server";
import {
	competitions,
	countries,
	events,
	fencers,
	liveBouts,
	pastBouts,
	pastTeamRelays,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { eq, and, desc, aliasedTable, or } from "drizzle-orm";
import { PastBoutModel, Round } from "~/lib/models";

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
		round: Number(b.round) as Round,
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

export async function getPastBouts(eventId: number): Promise<PastBoutModel[]> {
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
		round: Number(b.round) as Round,
		order: b.order,
		winnerIsA: b.winnerIsA,
		id: b.id,
	}));
}

export async function getPastRelaysMainBracket(eventId: number) {
	const countries2 = aliasedTable(countries, "countries2");
	return (
		await db
			.select({
				id: pastTeamRelays.id,
				teamA: {
					id: pastTeamRelays.teamA,
					name: countries.name,
					flag: countries.isoCode,
					score: pastTeamRelays.scoreA,
				},
				teamB: {
					id: pastTeamRelays.teamB,
					name: countries2.name,
					flag: countries2.isoCode,
					score: pastTeamRelays.scoreB,
				},
				round: pastTeamRelays.round,
				order: pastTeamRelays.order,
				winnerIsA: pastTeamRelays.winnerIsA,
			})
			.from(pastTeamRelays)
			.where(
				and(
					eq(pastTeamRelays.event, eventId),
					eq(pastTeamRelays.bracket, "MAIN")
				)
			)
			.leftJoin(countries, eq(pastTeamRelays.teamA, countries.iocCode))
			.leftJoin(countries2, eq(pastTeamRelays.teamB, countries2.iocCode))
	).map(r => ({
		teamA: {
			id: r.teamA.id,
			name: r.teamA.name!,
			score: r.teamA.score ?? undefined,
			flag: r.teamA.flag ?? undefined,
		},
		teamB: {
			id: r.teamB.id!,
			name: r.teamB.name!,
			score: r.teamB.score ?? undefined,
			flag: r.teamB.flag ?? undefined,
		},
		round: Number(r.round) as Round,
		order: r.order,
		winnerIsA: r.winnerIsA,
		id: r.id,
	}));
}

export async function getLiveTableau(eventId: number) {
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
		round: Number(b.round) as Round,
		order: b.order,
		winnerIsA: b.winnerIsA ?? undefined,
		id: b.id,
	}));
}

export async function getRelaysBetweenTeams(
	teamA: string,
	teamB: string,
	weapon: "FOIL" | "EPEE" | "SABER",
	gender: "MEN" | "WOMEN"
) {
	const fencers2 = aliasedTable(fencers, "fencers2");
	const countries2 = aliasedTable(countries, "countries2");
	return (
		await db
			.select({
				id: pastTeamRelays.id,
				teamA: {
					id: pastTeamRelays.teamA,
					name: countries.name,
					score: pastTeamRelays.scoreA,
					flag: countries.isoCode,
				},
				teamB: {
					id: pastTeamRelays.teamB,
					name: countries2.name,
					score: pastTeamRelays.scoreB,
					flag: countries2.isoCode,
				},
				round: pastTeamRelays.round,
				order: pastTeamRelays.order,
				winnerIsA: pastTeamRelays.winnerIsA,
				competition: competitions.name,
				event: {
					id: events.id,
					date: events.date,
				},
				bracket: pastTeamRelays.bracket,
			})
			.from(pastTeamRelays)
			.where(
				and(
					eq(events.weapon, weapon),
					eq(events.gender, gender),
					or(
						and(
							eq(pastTeamRelays.teamA, teamA),
							eq(pastTeamRelays.teamB, teamB)
						),
						and(
							eq(pastTeamRelays.teamA, teamB),
							eq(pastTeamRelays.teamB, teamB)
						)
					)
				)
			)
			.leftJoin(countries, eq(pastTeamRelays.teamA, countries.iocCode))
			.leftJoin(countries2, eq(pastTeamRelays.teamB, countries2.iocCode))
			.leftJoin(events, eq(events.id, pastTeamRelays.event))
			.leftJoin(competitions, eq(events.competition, competitions.id))
			.orderBy(desc(events.date))
	).map(b => ({
		teamA: {
			id: b.teamA.id!,
			name: b.teamA.name!,
			score: b.teamA.score ?? undefined,
			flag: b.teamA.flag ?? undefined,
		},
		teamB: {
			id: b.teamB.id!,
			name: b.teamB.name!,
			score: b.teamB.score ?? undefined,
			flag: b.teamB.flag ?? undefined,
		},
		round: Number(b.round) as Round,
		order: b.order,
		winnerIsA: b.winnerIsA,
		id: b.id,
		competition: b.competition!,
		event: {
			date: b.event!.date!,
			id: b.event!.id!,
		},
		bracket: b.bracket,
	}));
}
