import { NextRequest } from "next/server";
import { updatePastResults } from "~/server/past-results";

export async function GET(req: NextRequest) {
	if (
		req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}
	updatePastResults();
	return new Response("Cron job ran");
}
