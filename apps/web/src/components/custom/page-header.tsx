import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { ReactNode } from "react";
import { Flag } from "./flag";

export function PageHeader({
	flagCode,
	title,
	description,
	children,
}: {
	flagCode?: string;
	title: string;
	description: ReactNode;
	children?: ReactNode;
}) {
	return (
		<div className="md:p-6 md:pb-0">
			<Card className="rounded-none md:rounded-3xl  !p-6">
				<div className="flex flex-row gap-2 items-start">
					<Flag
						flagCode={flagCode}
						className="h-14 aspect-3/2 md:h-20 md:w-28"
					/>
					<CardHeader className="flex-grow">
						<CardTitle className="text-xl md:text-3xl">
							{title}
						</CardTitle>
						<CardDescription className="capitalize text-base font-medium md:text-xl">
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
