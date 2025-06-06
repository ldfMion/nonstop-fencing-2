import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../../../env";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL;
const dev = env.MODE == "DEV";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle({ client, schema, logger: dev });
