import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FeatureCards } from "./feature-cards";
import { router } from "~/lib/router";

export default function Home() {
	return (
		<div className="">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="w-full relative overflow-hidden grid grid-cols-1 md:grid-cols-2 md:h-[60vh]">
					<div className="flex flex-col justify-center space-y-4 p-20 md:py-40">
						<h1 className="text-3xl font-extrabold sm:text-5xl xl:text-6xl/none uppercase">
							Follow Fencing Like{" "}
							<span className="text-primary">Never Before</span>
						</h1>
					</div>
					<div className="flex flex-col items-start justify-center bg-primary gap-8 p-20 md:rounded-bl-4xl">
						<p className="max-w-[600px] md:text-xl text-primary-foreground">
							All international results in one place, live
							brackets, and personalized updates for fencing fans
							and athletes around the world.
						</p>
						<div className="flex flex-col gap-2">
							<Button size="lg" variant="secondary" asChild>
								<Link href={router.home}>
									Explore{" "}
									<ChevronRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Why Section */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center justify-center space-y-8">
							<div className="space-y-4 max-w-[800px]">
								<h2 className="text-3xl font-extrabold sm:text-4xl uppercase">
									Why?
								</h2>
								<p className="text-lg md:text-xl text-muted-foreground">
									Other sports have dedicated score apps for
									results and live scores like OneFootball,
									FotMob, SofaScore, TNNS Live, Flashscore,
									and others. I wanted to bring the same
									experience to fencing, focusing more on the
									fan perspective.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Current Features Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center justify-center space-y-8">
							<div className="space-y-4 max-w-[800px]">
								<h2 className="text-3xl font-extrabold sm:text-4xl uppercase">
									What's Currently Available
								</h2>
								<p className="text-lg md:text-xl text-muted-foreground">
									The platform currently supports live and
									past results for the second day of
									individual events, as well as having all
									events for the 2024-25 season. More features
									and coverage are being added regularly.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section
					id="features"
					className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
				>
					<div className="absolute inset-0 z-0"></div>
					<div className="container px-4 md:px-6 z-10 mx-auto relative">
						<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
							<div className="space-y-2 max-w-[800px]">
								<h2 className="text-3xl font-extrabold sm:text-5xl uppercase">
									Upgrading the Fencing Fan Experience
								</h2>
							</div>
						</div>

						<FeatureCards />

						<div className="mt-16 flex justify-center">
							<Button size="lg" className="rounded-full" asChild>
								<Link href="/competitions">
									Explore Events{" "}
									<ChevronRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
