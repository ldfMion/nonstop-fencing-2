import { redirect } from "next/navigation";
import { router } from "~/lib/router";
import { getEventsWithResults } from "../queries";

export const revalidate = false;

export async function generateStaticParams() {
	return (await getEventsWithResults()).map(e => ({
		id: e.id.toString(),
	}));
}

export default async function EventOverviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	redirect(router.event(id).bracket.past);
}
