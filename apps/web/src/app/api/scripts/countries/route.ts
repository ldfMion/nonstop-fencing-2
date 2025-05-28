import { NextRequest, NextResponse } from "next/server";
import { withTestRoute } from "~/infra/auth/test-route";
import { updateCountries } from "~/services/countries";

async function handler(req: NextRequest) {
	updateCountries();
	return new NextResponse();
}

export const GET = withTestRoute(handler);
