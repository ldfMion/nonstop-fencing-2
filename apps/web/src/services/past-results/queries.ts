import { events } from "~/infra/db/schema";
import { db } from "~/infra/db";
import { eq, and, lte } from "drizzle-orm";

export async function getEventsWithMissingResults() {
	let yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday = new Date(yesterday.toISOString().split("T")[0]);
	return db
		.select({ id: events.id })
		.from(events)
		.where(
			and(
				eq(events.type, "INDIVIDUAL"),
				eq(events.hasFieResults, false),
				lte(events.date, yesterday)
			)
		);
}
