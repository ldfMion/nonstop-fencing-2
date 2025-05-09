import { fetchCompetitions } from "./fie";
import {
	createName,
	mapFieEventsToDBCompetitions,
	mapFieEventToDBEvent,
} from "./fie/mappers";
import { db } from "../db";
import { competitions, events } from "../db/schema";

const newEvents = await fetchCompetitions(2025);
// const newCountries = events
// 	.map(event => ({
// 		iocCode: event.federation,
// 		isoCode: event.flag,
// 	}))
// 	.filter(
// 		(country, index, self) =>
// 			index ===
// 			self.findIndex(
// 				c =>
// 					c.iocCode === country.iocCode &&
// 					c.isoCode === country.isoCode
// 			)
// 	);
const newCompetitions = mapFieEventsToDBCompetitions(newEvents);
const uploadedCompetitions = await db
	.insert(competitions)
	.values(newCompetitions)
	.returning({ name: competitions.name, id: competitions.id });
const eventsWithCompetitions = newEvents.map(event =>
	mapFieEventToDBEvent(
		event,
		uploadedCompetitions.find(c => c.name == createName(event))!.id
	)
);
await db.insert(events).values(eventsWithCompetitions);
