import { NextRequest } from "next/server";
import { updatePastResults } from "~/services/past-results";
import { env } from "../../../../../env";

export async function GET(req: NextRequest) {
	if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}
	try {
		await updatePastResults();
		return new Response("Cron job ran");
	} catch (e) {
		return new Response(`Error: ${e}`, {
			status: 500,
		});
	}
}
