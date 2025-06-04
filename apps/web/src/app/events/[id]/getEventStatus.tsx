import { differenceInCalendarDays } from "date-fns";
import { EventModel } from "~/lib/models";

export function getEventStatus(event: EventModel) {
	const today = new Date();
	const diff = differenceInCalendarDays(today, event.date);
	if (diff > 1) {
		return "PAST";
	}
	if (diff < -2) {
		return "FUTURE";
	}
	return "LIVE";
}
