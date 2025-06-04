import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
export default function Loading() {
	return (
		<main className="p-4 max-w-4xl mx-auto flex flex-col gap-4">
			<Card className="p-0 gap-0 overflow-clip">
				<CardHeader className="p-6 gap-2 flex flex-row items-center bg-muted pb-2">
					<Skeleton className="h-10 w-md" />
				</CardHeader>
				<CardContent className="">
					{new Array(10).fill(null).map((_, i) => (
						<Skeleton
							className="h-15 border-t-2 rounded-none"
							key={i}
						/>
					))}
				</CardContent>
			</Card>
		</main>
	);
}
