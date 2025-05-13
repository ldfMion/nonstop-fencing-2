import { Suspense } from "react";
import { Filter } from "./filter";

export default function EventsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log("rendering layout");
	return (
		<div className="mx-auto px-4 max-w-xl">
			<div className="flex flex-row justify-between w-full items-center">
				<h1 className="text-2xl font-bold">Competitions</h1>
				<Suspense>
					<Filter />
				</Suspense>
			</div>
			{children}
		</div>
	);
}
