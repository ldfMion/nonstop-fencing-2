"use client";
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
import { BracketMatch, Round } from "~/lib/models";
import { Button } from "~/components/ui/button";
import { RoundBadge } from "./round-badge";

export function BracketCarousel({
	bracketData,
}: {
	bracketData: { id: Round; matches: BracketMatch[] }[];
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
			<div className="fixed bottom-0 right-0 z-10 flex space-x-2 p-10">
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
						{bracketData.map((round, index) => {
							const boutsInRound = round.matches;
							if (!boutsInRound || boutsInRound.length === 0) {
								return null; // Should not happen based on sortedRoundKeys filter, but good practice
							}

							return (
								<CarouselItem
									key={round.id}
									className="!flex-shrink-1 min-w-60 flex flex-col gap-2"
								>
									<RoundBadge roundKey={round.id} />
									<div className="h-full grid grid-cols-20">
										{index != 0 && (
											<div className="col-span-1 flex flex-col items-stretch transition-all duration-100 ease-in">
												{new Array(
													boutsInRound.length * 4
												)
													.fill(null)
													.map((_, index) =>
														index % 4 == 1 ? (
															<div
																key={index}
																className=" h-full grid grid-cols-3"
															>
																<div className="col-span-1 border-t-4 border-muted-foreground/50"></div>
																<div className="col-span-1 bg-muted-foreground/50 "></div>
																<div className="col-span-1 border-b-4 border-muted-foreground/50"></div>
															</div>
														) : index % 4 == 2 ? (
															<div
																key={index}
																className=" h-full grid grid-cols-3"
															>
																<div className="col-span-1 border-b-4 border-muted-foreground/50"></div>
																<div className="col-span-1 bg-muted-foreground/50  "></div>
																<div className="col-span-1  "></div>
															</div>
														) : (
															<div
																key={index}
																className=" h-full "
															></div>
														)
													)}
											</div>
										)}
										<div
											className={cn(
												"flex flex-col gap-2 justify-around h-full transition-all duration-100 ease-in col-span-20 ",
												index != 0 && "col-span-19"
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
															index <
																slidesInView[0]
														)
													}
												/>
											))}
										</div>
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
