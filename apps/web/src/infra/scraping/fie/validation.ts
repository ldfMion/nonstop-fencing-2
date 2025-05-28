import { z } from "zod";

const scrapedTeamSchema = z
	.object({
		name: z.string(),
		nationality: z.string().length(3),
		isWinner: z.boolean(),
		score: z.number(),
	})
	.or(
		z.object({
			name: z.null(),
			nationality: z.null(),
			isWinner: z.boolean(),
			score: z.literal(0),
		})
	);

const scrapedTeamEventResultsSchema = z.array(
	z.object({
		suiteTableId: z.string(),
		rounds: z.record(
			z.string(),
			z.array(
				z.object({
					fencer1: scrapedTeamSchema,
					fencer2: scrapedTeamSchema,
				})
			)
		),
	})
);

export function validateTeamResults(scrapedResults: unknown) {
	const result = scrapedTeamEventResultsSchema.safeParse(scrapedResults);
	if (result.success) {
		return result.data;
	}
	console.log(JSON.stringify(scrapedResults));
	throw new Error(result.error.message);
}

export type FieTeamResults = z.infer<typeof scrapedTeamEventResultsSchema>;
