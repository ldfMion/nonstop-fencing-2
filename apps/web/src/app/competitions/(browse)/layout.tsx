import { Suspense } from "react";
import { Filter } from "./filter";
import { StatusTabs } from "./status-tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Competitions | Nonstop Fencing",
	description: "Browser International Fencing Competitions",
};

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
					<div className="max-w-lg w-full flex flex-col gap-0">
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
