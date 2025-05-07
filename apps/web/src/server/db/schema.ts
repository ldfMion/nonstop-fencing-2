import * as t from "drizzle-orm/pg-core";

export const weaponsEnum = t.pgEnum("weapons", ["FOIL", "EPEE", "SABER"]);
export const gendersEnum = t.pgEnum("genders", ["MEN", "WOMEN"]);
export const typeEnum = t.pgEnum("types", ["INDIVIDUAL", "TEAM"]);

export const events = t.pgTable("events_0", {
	id: t.serial("id").primaryKey(),
	name: t.text("name").notNull(),
	// ioc country code from the .federation property on the FIE API
	countryCode: t.char("country_code", { length: 3 }).notNull(),
	date: t.date("date", { mode: "date" }).notNull(),
	weapon: weaponsEnum("weapon").notNull(),
	type: typeEnum("type").notNull(),
	gender: gendersEnum("gender").notNull(),
	hasFieResults: t.boolean("has_fie_results").default(false),
	season: t
		.integer("season")
		.references(() => seasons.id)
		.notNull(),
	fieCompetitionId: t.integer("fie_competition_id").unique().notNull(),
});

export const seasons = t.pgTable("seasons_0", {
	id: t.integer("id").primaryKey(),
});
