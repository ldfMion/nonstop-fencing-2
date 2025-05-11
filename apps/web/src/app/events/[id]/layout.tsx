import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { EventModel } from "~/models";
import { QUERIES } from "~/server/db/queries";
import Image from "next/image";
import { TabsNavigation } from "./tabs-navigation";

export default async function EventLayout({
	children,
	params,
}: {
	children: Readonly<React.ReactNode>;
	params: Promise<{ id: string }>;
}) {
	const { id: eventId } = await params;
	const event = await QUERIES.getEvent(Number(eventId));
	return (
		<>
			<div className="lg:px-6">
				<Card className="rounded-none lg:rounded-3xl  !p-6 ">
					<div className="flex flex-row gap-2 items-start">
						{event.flag && (
							<div className="h-14 aspect-3/2 md:h-20 md:w-28 overflow-hidden rounded-sm border self-stretch">
								<Image
									src={`https://flagcdn.com/w1280/${event.flag.toLowerCase()}.png`}
									alt={`${event.flag} flag`}
									className="h-full w-full object-cover"
									height={400}
									width={400}
								/>
							</div>
						)}
						<CardHeader className="flex-grow">
							<CardTitle className="text-xl md:text-3xl">
								{event.name}
							</CardTitle>
							<CardDescription className="capitalize text-base md:text-xl">
								{formatEventDescription(event)}
							</CardDescription>
						</CardHeader>
					</div>
					<CardContent className="p-0">
						<TabsNavigation />
					</CardContent>
				</Card>
			</div>
			{children}
		</>
	);
}

function formatEventDescription(event: EventModel) {
	return `${event.gender == "MEN" ? "Men's" : "Women's"} ${event.weapon.toLowerCase()} ${event.type.toLowerCase()}`;
}
