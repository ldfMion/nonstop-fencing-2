import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const weaponsEnum = t.pgEnum("weapons", ["FOIL", "EPEE", "SABER"]);
export const gendersEnum = t.pgEnum("genders", ["MEN", "WOMEN"]);
export const typeEnum = t.pgEnum("types", ["INDIVIDUAL", "TEAM"]);

export const competitions = t.pgTable("competitions_0", {
	id: t.serial("id").primaryKey(),
	name: t.text("name").notNull(),
	// ioc country code from the .federation property on the FIE API
	host: t
		.char("host", { length: 3 })
		.references(() => countries.iocCode)
		.notNull(),
	season: t
		.integer("season")
		.references(() => seasons.id)
		.notNull(),
});

export const events = t.pgTable("events_0", {
	id: t.serial("id").primaryKey(),
	competition: t
		.integer("competition")
		.references(() => competitions.id)
		.notNull(),
	date: t.date("date", { mode: "date" }).notNull(),
	weapon: weaponsEnum("weapon").notNull(),
	type: typeEnum("type").notNull(),
	gender: gendersEnum("gender").notNull(),
	hasFieResults: t.boolean("has_fie_results").notNull(),
	fieCompetitionId: t.integer("fie_competition_id").unique().notNull(),
	hasResults: t.boolean().notNull().default(false),
});

export const countries = t.pgTable("countries_0", {
	iocCode: t.char("ioc_code", { length: 3 }).primaryKey(),
	isoCode: t.char("iso_code", { length: 2 }).unique().notNull(),
});

export const competitionsRelations = relations(
	competitions,
	({ many, one }) => ({
		events: many(events),
		host: one(countries, {
			fields: [competitions.host],
			references: [countries.iocCode],
		}),
	})
);

export const eventsRelations = relations(events, ({ one }) => ({
	competition: one(competitions, {
		fields: [events.competition],
		references: [competitions.id],
	}),
}));

export const seasons = t.pgTable("seasons_0", {
	id: t.integer("id").primaryKey(),
});

export const seasonsRelations = relations(seasons, ({ many }) => ({
	competitions: many(competitions),
}));
