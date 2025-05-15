import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const weaponsEnum = t.pgEnum("weapons", ["FOIL", "EPEE", "SABER"]);
export const gendersEnum = t.pgEnum("genders", ["MEN", "WOMEN"]);
export const typeEnum = t.pgEnum("types", ["INDIVIDUAL", "TEAM"]);
export const roundEnum = t.pgEnum("rounds", ["2", "4", "8", "16", "32", "64"]);

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
	lastLiveUpdate: t.timestamp("last_live_update", {
		withTimezone: true,
		mode: "date",
	}),
	liveResultsTableauUrl: t.text("live_results_tableau_url"),
});

export const countries = t.pgTable("countries_0", {
	iocCode: t.char("ioc_code", { length: 3 }).primaryKey(),
	isoCode: t.char("iso_code", { length: 2 }).unique(),
});

export const fencers = t.pgTable(
	"fencers_0",
	{
		id: t.serial("id").primaryKey(),
		firstName: t.text("first_name").notNull(),
		lastName: t.text("last_name").notNull(),
		country: t
			.char("country", { length: 3 })
			.references(() => countries.iocCode)
			.notNull(),
		gender: gendersEnum("gender").notNull(),
	},
	table => [t.unique().on(table.firstName, table.lastName, table.country)]
);

export const liveBouts = t.pgTable(
	"live_bouts_0",
	{
		id: t.serial("id").primaryKey(),
		fencerA: t.integer("fencer_a").references(() => fencers.id),
		fencerB: t.integer("fencer_b").references(() => fencers.id),
		fencerAScore: t.smallint("fencer_a_score"),
		fencerBScore: t.smallint("fencer_b_score"),
		winnerIsA: t.boolean("winner_is_a"),
		round: roundEnum("round").notNull(),
		order: t.integer("order").notNull(),
		event: t
			.integer("event")
			.references(() => events.id)
			.notNull(),
	},
	table => [
		t.check(
			"at_least_one_fencer",
			sql`${table.fencerA} IS NOT NULL OR ${table.fencerB} IS NOT NULL`
		),
		t.unique().on(table.event, table.order, table.round),
	]
);

export const pastBouts = t.pgTable(
	"past_bouts_0",
	{
		id: t.serial("id").primaryKey(),
		fencerA: t
			.integer("fencer_a")
			.references(() => fencers.id)
			.notNull(),
		fencerB: t
			.integer("fencer_b")
			.references(() => fencers.id)
			.notNull(),
		fencerAScore: t.smallint("fencer_a_score").notNull(),
		fencerBScore: t.smallint("fencer_b_score").notNull(),
		winnerIsA: t.boolean("winner_is_a").notNull(),
		round: roundEnum("round").notNull(),
		order: t.integer("order").notNull(),
		event: t
			.integer("event")
			.references(() => events.id)
			.notNull(),
	},
	table => [t.unique().on(table.event, table.order, table.round)]
);

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

export const liveBoutsRelations = relations(liveBouts, ({ one }) => ({
	fencerA: one(fencers),
	fencerB: one(fencers),
}));

export const pastBoutsRelations = relations(pastBouts, ({ one }) => ({
	fencerA: one(fencers),
	fencerB: one(fencers),
}));

export const fencersRelations = relations(fencers, ({ many }) => ({
	liveBouts: many(liveBouts),
	pastBouts: many(pastBouts),
}));
