import { NextRequest, NextResponse } from "next/server";
import { withTestRoute } from "~/infra/auth/test-route";
import { fetchCompetitions } from "~/infra/scraping/fie";

async function handler(req: NextRequest) {
	return new NextResponse();
}

export const GET = withTestRoute(handler);
