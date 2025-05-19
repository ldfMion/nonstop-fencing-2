import { Suspense } from "react";
import { Filter } from "./filter";
import { StatusTabs } from "./status-tabs";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

export default function CompetitionsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="p-6 lg:p-12">
			<div className="md:flex md:flex-row md:items-start gap-6">
				<div className="flex flex-row md:flex-col md:items-start  justify-between  items-center gap-6">
					<h1 className="text-2xl lg:text-3xl font-bold m-0 self-start">
						Competitions
					</h1>
					<div className="max-w-md">
						<Filter />
					</div>
				</div>
				<div className="flex flex-col items-center md:w-full self-stretch ">
					<div className="max-w-lg w-full ">
						<Suspense>
							<StatusTabs />
						</Suspense>
						{children}
					</div>
				</div>
			</div>
		</main>
	);
}
