import { Filter } from "./filter";
import Link from "next/link";
import { StatusTabs } from "./status-tabs";

export default function CompetitionsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="mx-auto p-6">
			<div className="md:grid md:grid-cols-3 lg:grid-cols-2 gap-6">
				<div className="col-span-1 flex flex-row md:flex-col justify-between md:justify-start items-center gap-6">
					<h1 className="text-2xl lg:text-3xl font-bold m-0 self-start">
						Competitions
					</h1>
					<div className="max-w-md md:w-full">
						<Filter />
					</div>
				</div>
				<div className="flex flex-col col-span-2 lg:col-span-1 items-center">
					<div className="max-w-lg w-full">
						<StatusTabs />
						{children}
					</div>
				</div>
			</div>
		</main>
	);
}
