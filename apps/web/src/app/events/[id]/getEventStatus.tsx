import { differenceInCalendarDays } from "date-fns";
import { EventModel } from "~/models";

export function getEventStatus(event: EventModel) {
	const today = new Date();
	const diff = differenceInCalendarDays(today, event.date);
	console.log(diff);
	if (diff > 1) {
		return "PAST";
	}
	if (diff < -2) {
		return "FUTURE";
	}
	return "LIVE";
}
