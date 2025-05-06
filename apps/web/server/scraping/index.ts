import { fetchCompetitions } from "./fie";
import { MUTATIONS } from "../db/queries";
import { mapFieEventToDBEvent } from "./mappers";

const events = await fetchCompetitions();
console.log("fetched events");
MUTATIONS.uploadEvents(events.map(mapFieEventToDBEvent));
