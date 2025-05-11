import { updateLiveEvents } from "~/server/live";

export async function POST() {
	await updateLiveEvents();
	return Response.json({});
}
