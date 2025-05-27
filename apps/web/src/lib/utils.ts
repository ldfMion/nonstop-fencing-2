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
	const today = getToday();
	const difference = Math.abs(differenceInCalendarDays(date, today));
	return toTitleCase(
		difference > 6
			? formatFullDate(date)
			: intlFormatDistance(date, today, { unit: "day" })
	);
}

export function formatFullDate(date: Date) {
	return format(date.toISOString().split("T")[0], "EEEE MMM dd");
}

export function withoutTime(date: Date) {
	return new Date(date.toISOString().split("T")[0]);
}

export function getToday() {
	return withoutTime(new Date());
	// const yesterday = new Date();
	// yesterday.setDate(yesterday.getDate() - 2);
	// return withoutTime(yesterday);
}

export function isToday(date: Date) {
	const today = getToday();
	return today.getTime() === withoutTime(date).getTime();
}
