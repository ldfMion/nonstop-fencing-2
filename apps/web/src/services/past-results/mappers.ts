import { ScrapedPastTeamRelayDto } from "~/infra/scraping/dtos";
import { NewRelayDto } from "./queries";

export function mapScrapedTeamRelaysToNewRelayDto(
	relays: ScrapedPastTeamRelayDto[],
	event: { id: number }
): NewRelayDto[] {
	return relays.map(relay => ({
		event: event.id,
		teamA: relay.teamACode,
		teamB: relay.teamBCode,
		scoreA: relay.teamAScore,
		scoreB: relay.teamBScore,
		winnerIsA: relay.winnerIsA,
		bracket: relay.bracket,
		round: relay.round,
		order: relay.order,
	}));
}

export function getCountriesFromRelays(relays: NewRelayDto[]) {
	const codes = relays.reduce((acc, relay) => {
		if (!acc.includes(relay.teamA)) {
			acc.push(relay.teamA);
		}
		if (!acc.includes(relay.teamB)) {
			acc.push(relay.teamB);
		}
		return acc;
	}, [] as string[]);
	return codes.map(code => ({ iocCode: code }));
}
