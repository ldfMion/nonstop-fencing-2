import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

function LoadingCard() {
	return (
		<Card className="mb-2 shadow-none rounded-3xl flex flex-col gap-2">
			<CardHeader className="flex flex-row gap-2 items-center">
				<Skeleton className="w-12 h-8 rounded-[8px]" />
				<div className="flex flex-col gap-2 flex-1">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-3 w-[150px]" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex gap-2">
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-16" />
				</div>
			</CardContent>
		</Card>
	);
}

export default function LoadingCompetitions() {
	return (
		<>
			{[...Array(6)].map((_, index) => (
				<LoadingCard key={index} />
			))}
		</>
	);
}
