import { clsx, type ClassValue } from "clsx";
import { differenceInCalendarDays, format, intlFormatDistance } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDateRange(date: { start: Date; end: Date }) {
	return `${format(date.start, "MMM d")} - ${format(
		date.end,
		"MMM d, yyyy"
	)}`;
}

export function formatEventDescription(event: {
	weapon: "FOIL" | "EPEE" | "SABER";
	type: "INDIVIDUAL" | "TEAM";
	gender: "MEN" | "WOMEN";
}) {
	return toTitleCase(
		`${event.gender == "MEN" ? "Men's" : "Women's"} ${event.weapon} ${
			event.type
		}`
	);
}

export function toTitleCase(s: string) {
	return s
		.toLowerCase()
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function formatRelativeDate(date: Date) {
	const today = new Date(new Date().toISOString().split("T")[0]);
	const difference = Math.abs(differenceInCalendarDays(date, today));
	return toTitleCase(
		difference > 6
			? format(date, "EEEE MMM dd")
			: intlFormatDistance(date, today, { unit: "day" })
	);
}
