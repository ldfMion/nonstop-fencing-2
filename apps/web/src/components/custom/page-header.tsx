import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { JSX } from "react";

export function PageHeader({
	flagCode,
	title,
	description,
	children,
}: {
	flagCode?: string;
	title: string;
	description: string;
	children?: JSX.Element;
}) {
	return (
		<div className="md:px-6">
			<Card className="rounded-none md:rounded-3xl  !p-6 ">
				<div className="flex flex-row gap-2 items-start">
					{flagCode && (
						<div className="h-14 aspect-3/2 md:h-20 md:w-28 overflow-hidden rounded-sm border self-stretch">
							<Image
								src={`https://flagcdn.com/w1280/${flagCode.toLowerCase()}.png`}
								alt={`${flagCode} flag`}
								className="h-full w-full object-cover"
								height={400}
								width={400}
							/>
						</div>
					)}
					<CardHeader className="flex-grow">
						<CardTitle className="text-xl md:text-3xl">
							{title}
						</CardTitle>
						<CardDescription className="capitalize text-base md:text-xl">
							{description}
						</CardDescription>
					</CardHeader>
				</div>
				{children && (
					<CardContent className="p-0">{children}</CardContent>
				)}
			</Card>
		</div>
	);
}
