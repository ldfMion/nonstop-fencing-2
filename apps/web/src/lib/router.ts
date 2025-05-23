import { z } from "zod";

export const router = {
	api: {
		live: `/api/live`,
	},
	competition: (id: number) => `/competitions/${id}`,
	competitions: (params?: z.infer<typeof competitionsSearchParamsSchema>) =>
		!params
			? `/competitions`
			: `/competitions?${turnObjectIntoSearchParams(params)}`,
	event: (id: number | string) => ({
		bracket: {
			past: `/events/${id}/bracket`,
			live: `/events/${id}/bracket/live`,
		},
		overview: `/events/${id}`,
	}),
	about: "/about",
	home: `/`,
};

export function parseCompetitionSearchParams(
	params:
		| {
				[key: string]: string | string[] | undefined;
		  }
		| undefined
) {
	return competitionsSearchParamsSchema.parse(params);
}

const competitionsSearchParamsSchema = z
	.object({
		gender: z.literal("men").or(z.literal("women")).optional(),
		weapon: z
			.literal("foil")
			.or(z.literal("epee"))
			.or(z.literal("saber"))
			.optional(),
		type: z.literal("individual").or(z.literal("team")).optional(),
		status: z.literal("upcoming").or(z.literal("previous")).optional(),
	})
	.optional();

function turnObjectIntoSearchParams(obj: { [key: string]: string | string[] }) {
	const params = new URLSearchParams();
	Object.entries(obj).forEach(([key, value]) =>
		params.set(key, typeof value == "string" ? value : value.join(","))
	);
	return params.toString();
}
