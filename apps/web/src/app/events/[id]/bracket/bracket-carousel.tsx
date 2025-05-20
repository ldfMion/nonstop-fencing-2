"use client";
import { BracketBout } from "./bracket";
import { Bout } from "./bout";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { CarouselApi } from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "~/components/ui/carousel"; // Import Shadcn Carousel components
import { useEffect, useState } from "react";
import { Round } from "~/lib/models";
import { Button } from "~/components/ui/button";

export function BracketCarousel({
	sortedRoundKeys,
	rounds,
}: {
	sortedRoundKeys: BracketBout["round"][];
	rounds: Record<BracketBout["round"], BracketBout[]>;
}) {
	const [api, setApi] = useState<CarouselApi>();
	const [slidesInView, setSlidesInView] = useState<number[]>();
	//? idk if useEffect is needed here but this is how it was in the Embla docs
	useEffect(() => {
		api?.on("slidesInView", () => setSlidesInView(api.slidesInView()));
	}, [api]);

	return (
		<Carousel
			opts={{
				align: "start",
			}}
			className="w-full"
			setApi={setApi}
		>
			<div className="absolute top-0 right-0 z-10 flex space-x-2 p-4">
				<Button asChild variant="default">
					<CarouselPrevious className="!p-4 static transform-none left-auto right-auto translate-x-0 translate-y-0 h-7 w-7 border-none" />
				</Button>
				<Button asChild variant="default">
					<CarouselNext className="!p-4 static transform-none left-auto right-auto translate-x-0 translate-y-0 h-7 w-7 border-none" />
				</Button>
			</div>
			<div className="p-0 md:p-6">
				<Card className="p-6 bg-transparent md:bg-card rounded-none md:rounded-2xl border-none md:border-solid">
					<CarouselContent className="">
						{" "}
						{/* Negative margin for item spacing */}
						{sortedRoundKeys.map((roundKey, index) => {
							const boutsInRound = rounds[roundKey];
							if (!boutsInRound || boutsInRound.length === 0) {
								return null; // Should not happen based on sortedRoundKeys filter, but good practice
							}

							return (
								<CarouselItem
									key={roundKey}
									className="!flex-shrink-1 min-w-60 flex flex-col gap-2"
								>
									<Badge
										className="text-base font-semibold"
										variant="secondary"
									>
										{getRoundDisplayName(roundKey)}
									</Badge>
									<div
										className={cn(
											"flex flex-col gap-2 justify-around h-full transition-all duration-100 ease-in"
										)}
									>
										{boutsInRound.map(bout => (
											<Bout
												key={`${bout.round}-${bout.order}`}
												bout={bout}
												hidden={
													!!(
														slidesInView &&
														slidesInView[0] &&
														index < slidesInView[0]
													)
												}
											/>
										))}
									</div>
								</CarouselItem>
							);
						})}
					</CarouselContent>
				</Card>
			</div>
		</Carousel>
	);
}

function getRoundDisplayName(round: Round) {
	switch (round) {
		case "2":
			return "Final";
		case "4":
			return "Semi-Final";
		default:
			return `T${round}`;
	}
}
