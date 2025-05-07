import { fetchCompetitions } from "./fie";
import { MUTATIONS } from "../db/queries";
import { mapFieEventToDBEvent } from "./mappers";
import { db } from "../db";
import { countries } from "../db/schema";

const events = await fetchCompetitions(2025);
const newCountries = events
	.map(event => ({
		iocCode: event.federation,
		isoCode: event.flag,
	}))
	.filter(
		(country, index, self) =>
			index ===
			self.findIndex(
				c =>
					c.iocCode === country.iocCode &&
					c.isoCode === country.isoCode
			)
	);
// db.insert(countries).values(newCountries);
// MUTATIONS.uploadEvents(events.map(mapFieEventToDBEvent));
