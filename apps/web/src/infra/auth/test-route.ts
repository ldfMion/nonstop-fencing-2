import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../env";

export function withTestRoute(handler: RouteHandler) {
	return (req: NextRequest) => {
		if (
			req.headers.get("Authorization") !=
			`Bearer ${env.TEST_ROUTES_SECRET}`
		) {
			return new Response("Unauthorized", {
				status: 401,
			});
		}
		return handler(req);
	};
}

type RouteHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;
