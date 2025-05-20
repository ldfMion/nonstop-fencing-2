import { Skeleton } from "~/components/ui/skeleton";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils"; // Assuming cn is already configured as shown in your import

interface LoadingBracketProps {
	/** The number of skeleton rounds to display */
	numberOfRounds?: number;
	/** The number of skeleton bouts within each round */
	boutsPerRound?: number;
}

export function LoadingBracket({
	numberOfRounds = 3, // Default to showing 3 rounds
	boutsPerRound = 2, // Default to showing 2 bouts per round
}: LoadingBracketProps) {
	// Create arrays to easily map over for generating skeletons
	const rounds = Array.from({ length: numberOfRounds });
	const bouts = Array.from({ length: boutsPerRound });

	return (
		<div className="w-full relative">
			{/* Skeleton for navigation buttons */}
			<div className="absolute top-0 right-0 z-10 flex space-x-2 p-4">
				<Skeleton className="h-7 w-7 rounded" />
				<Skeleton className="h-7 w-7 rounded" />
			</div>

			<div className="p-0 md:p-6">
				<Card className="p-6 bg-transparent md:bg-card rounded-none md:rounded-2xl border-none md:border-solid">
					{/* Mimic CarouselContent structure - flex row for rounds */}
					<div
						className={cn(
							"flex gap-4 overflow-hidden",
							"pl-4 md:pl-0"
						)}
					>
						{rounds.map((_, roundIndex) => (
							<div
								key={`loading-round-${roundIndex}`}
								className={cn(
									"!flex-shrink-0 min-w-60 flex flex-col gap-2",
									"w-full md:w-auto" // Adjust width for smaller screens if needed
								)}
							>
								{/* Skeleton for Round Badge */}
								<Skeleton className="h-6 w-24" />

								{/* Mimic Bout container - flex col for bouts */}
								<div
									className={cn(
										"flex flex-col gap-2 justify-around h-full"
									)}
								>
									{/* Skeletons for Bouts */}
									{bouts.map((_, boutIndex) => (
										<Skeleton
											key={`loading-bout-${roundIndex}-${boutIndex}`}
											className="h-16 w-full" // Adjust height/width to resemble a bout card
										/>
									))}
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
}
