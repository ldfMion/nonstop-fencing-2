import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";
import "dotenv/config";

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		DATABASE_URL: z.string().url(),
		MODE: z.enum(["DEV", "PROD"]),
		BLESS_TOKEN: z.string(),
		CRON_SECRET: z.string(),
		TEST_ROUTES_SECRET: z.string(),
		DATABASE_URL_CONFIG: z.string(),
	},

	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		MODE: process.env.MODE,
		BLESS_TOKEN: process.env.BLESS_TOKEN,
		CRON_SECRET: process.env.CRON_SECRET,
		TEST_ROUTES_SECRET: process.env.TEST_ROUTES_SECRET,
		DATABASE_URL_CONFIG: process.env.DATABASE_URL_CONFIG,
	},
});
