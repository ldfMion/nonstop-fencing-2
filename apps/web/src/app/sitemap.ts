import type { MetadataRoute } from "next";
import { getEventsWithResults } from "./events/queries";
import { getCompetitions } from "./competitions/queries";
import { router } from "~/lib/router";
import { getAllFencers } from "./fencers/queries";

const root = "https://nonstopfencing.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const events = await getEventsWithResults();
	const competitions = await getCompetitions(2025);
	const fencers = await getAllFencers();
	return [
		{
			url: root + router.home,
			lastModified: new Date(),
		},
		{
			url: root + router.competitions(),
			lastModified: new Date(),
		},
		...events.map(e => ({
			url: root + router.event(e.id).bracket.past,
			lastModified: new Date(),
		})),
		...competitions.map(c => ({
			url: root + router.competition(c.id),
		})),
		...fencers.map(f => ({
			url: root + router.fencer(f.id),
		})),
	];
}
