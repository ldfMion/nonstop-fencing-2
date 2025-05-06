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
	},

	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
	},
});
