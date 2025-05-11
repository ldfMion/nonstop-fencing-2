import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FeatureCards } from "./feature-cards";

export default function Home() {
	return (
		<div className="">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden">
					<div className="absolute inset-0 top-0 bg-gradient-to-br from-primary/20 via-background to-background -skew-y-6 transform-gpu -translate-y-24 z-0"></div>
					<div className="container px-4 md:px-6 relative z-10">
						<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
							<div className="flex flex-col justify-center space-y-4 p-10">
								<div className="space-y-2">
									<h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none anton">
										Follow Fencing Like{" "}
										<span className="text-primary">
											Never Before
										</span>
									</h1>
									<p className="max-w-[600px] text-muted-foreground md:text-xl">
										Real-time scores, comprehensive results,
										and personalized updates for fencing
										enthusiasts around the world.
									</p>
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Button
										size="lg"
										className="rounded-full"
										asChild
									>
										<Link href="/events">
											Explore Events{" "}
											<ChevronRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="relative aspect-video overflow-hidden rounded-3xl border bg-background md:w-full lg:order-last shadow-lg transform rotate-1">
									<Image
										src="/hero.png"
										width={850}
										height={550}
										alt="Nonstop Fencing App Preview"
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0" />
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section
					id="features"
					className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-tr from-background via-background to-primary/10 z-0"></div>
					<div className="container px-4 md:px-6 z-10 mx-auto relative">
						<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
							<div className="space-y-2 max-w-[800px]">
								<h2 className="text-3xl font-bold sm:text-5xl anton">
									Upgrading the Fencing Fan Experience
								</h2>
							</div>
						</div>

						<FeatureCards />

						<div className="mt-16 flex justify-center">
							<Button size="lg" className="rounded-full" asChild>
								<Link href="/events">
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
