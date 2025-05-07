import { fetchCompetitions } from "./fie";
import { MUTATIONS } from "../db/queries";
import { mapFieEventToDBEvent } from "./mappers";

const events = await fetchCompetitions(2025);
MUTATIONS.uploadEvents(events.map(mapFieEventToDBEvent));
