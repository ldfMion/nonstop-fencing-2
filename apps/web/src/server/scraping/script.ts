import { QUERIES } from "../db/queries";
import { getTableauData } from "./fencing-worldwide";

const event = await QUERIES.getEvent(59);
getTableauData(
	event,
	"https://www.fencingworldwide.com/en/29843-2024/tournament/"
);
