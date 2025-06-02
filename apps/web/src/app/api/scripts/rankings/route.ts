import { NextRequest, NextResponse } from "next/server";
import { withTestRoute } from "~/infra/auth/test-route";
import { updateRankings } from "~/services/rankings";

async function handler(req: NextRequest) {
	updateRankings();
	return new NextResponse();
}

export const GET = withTestRoute(handler);
