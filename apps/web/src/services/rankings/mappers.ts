import { ScrapedIndividualRankingDto } from "~/infra/scraping/dtos";
import { NewFencerDto, NewIndividualRankingDto } from "./queries";

export function mapScrapedFencersToDbDto(
	rankings: ScrapedIndividualRankingDto
): NewFencerDto[] {
	return rankings
		.map(ranking => ({
			firstName: ranking.fencer.firstName,
			lastName: ranking.fencer.lastName,
			country: ranking.fencer.country,
			gender: ranking.gender,
		}))
		.filter(
			(fencer, index, self) =>
				self.findIndex(
					other =>
						other.firstName === fencer.firstName &&
						other.lastName === fencer.lastName &&
						other.country === fencer.country &&
						other.gender === fencer.gender
				) === index
		);
}

export function mapScrapedIndividualRankingsToDbDto(
	rankings: ScrapedIndividualRankingDto,
	fencers: {
		firstName: string;
		lastName: string;
		country: string;
		gender: "MEN" | "WOMEN";
		id: number;
	}[]
): NewIndividualRankingDto[] {
	return rankings.map(ranking => ({
		fencer: findFencerId(
			{ ...ranking.fencer, gender: ranking.gender },
			fencers
		),
		position: ranking.position,
		weapon: ranking.weapon,
		gender: ranking.gender,
		season: ranking.season,
	}));
}

function findFencerId<
	Fencer extends {
		firstName: string;
		lastName: string;
		country: string;
		gender: "MEN" | "WOMEN";
	}
>(fencer: Fencer, fencers: (Fencer & { id: number })[]) {
	return fencers.find(
		f =>
			f.firstName === fencer.firstName &&
			f.lastName === fencer.lastName &&
			f.country === fencer.country &&
			f.gender === fencer.gender
	)!.id;
}
