import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withTestRoute } from "~/infra/auth/test-route";
import { db } from "~/infra/db";
import { competitionsWithFlagsAndEvents, events } from "~/infra/db/schema";
import { withBrowserless } from "~/infra/scraping/browserless";
import { getIndividualEventData, getTeamEventData } from "~/infra/scraping/fie";

async function handler(req: NextRequest) {
	const event = await db
		.select()
		.from(competitionsWithFlagsAndEvents)
		.where(eq(competitionsWithFlagsAndEvents.type, "TEAM"))
		.limit(1);
	await withBrowserless([
		async browser => {
			/*
			await updateTeamEvent(
				{
					id: event[0].eventId,
					season: event[0].season,
					fieCompetitionId: event[0].fieCompetitionId,
				},
				browser
			);
            */
		},
	]);
	return new NextResponse();
}

export const GET = withTestRoute(handler);
