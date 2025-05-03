import { getTableauData } from "./fencing-time-live";
import { fetchCompetitions, getEventData } from "./fie";
import assert from "assert";
import { getLiveResults } from "./live-results";

// console.log(await getTableauData());
const events = await fetchCompetitions();
// console.log(events);
const vancouver = events.find(event =>
	event.location.toLowerCase().includes("vancouver")
);
assert(vancouver);
getLiveResults(vancouver);
// const eventData = await getEventData(vancouver);
// assert(eventData[1] != undefined, "No data found");
// console.log(eventData[1].rounds);

/*
{
  season: 2025,
  competitionId: 147,
  name: "Coupe du Monde",
  location: "Vancouver",
  country: "canada",
  federation: "CAN",
  flag: "CA",
  startDate: "02-05-2025",
  endDate: "03-05-2025",
  weapon: "foil",
  weapons: [ "foil" ],
  gender: "men",
  category: "senior",
  categories: [ "senior" ],
  type: "individual",
  hasResults: 0,
  isSubCompetition: false,
  isLink: true,
}
*/
