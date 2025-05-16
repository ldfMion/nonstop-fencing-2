import { Filter } from "./filter";

export default function EventsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log("rendering layout");
	return (
		<main className="mx-auto px-6">
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
					<div className="max-w-lg w-full">{children}</div>
				</div>
			</div>
		</main>
	);
}
