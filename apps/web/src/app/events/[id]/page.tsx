import { redirect } from "next/navigation";
import { router } from "~/lib/router";

export default async function EventOverviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	redirect(router.event(id).bracket.past);
}
