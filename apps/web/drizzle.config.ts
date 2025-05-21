import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/infra/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
