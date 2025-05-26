import { NextRequest, NextResponse } from "next/server";
import { withTestRoute } from "~/infra/auth/test-route";
import { testEngarde } from "~/infra/scraping/engarde/test";

async function handler(req: NextRequest) {
	testEngarde();
	return new NextResponse();
}

export const GET = withTestRoute(handler);
