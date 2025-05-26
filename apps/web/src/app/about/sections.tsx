"use client";

import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
	ChevronRight,
	Trophy,
	Users,
	Zap,
	Eye,
	Calendar,
	Globe,
} from "lucide-react";
import Link from "next/link";
import { router } from "~/lib/router";

const fadeInUp = {
	initial: { opacity: 0, y: 60 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6 },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const scaleIn = {
	initial: { opacity: 0, scale: 0.8 },
	animate: { opacity: 1, scale: 1 },
	transition: { duration: 0.5 },
};

export function LandingPageSections() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			{/* Hero Section */}
			<section className="w-full relative overflow-hidden">
				<div className="grid grid-cols-1 md:grid-cols-2 md:h-[70vh] relative">
					<motion.div
						className="flex flex-col justify-center space-y-6 p-8 md:p-20"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.6 }}
						></motion.div>

						<motion.h1
							className="text-4xl font-extrabold sm:text-5xl xl:text-6xl/none uppercase tracking-tight"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.6 }}
						>
							Follow Fencing Like{" "}
							<span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
								Never Before
							</span>
						</motion.h1>
					</motion.div>

					<motion.div
						className="flex flex-col items-start justify-center bg-gradient-to-br from-primary to-primary/90 gap-8 p-8 md:p-20 md:rounded-bl-4xl relative overflow-hidden"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
						<motion.p
							className="max-w-[600px] md:text-xl text-primary-foreground/90 leading-relaxed relative z-10"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.6 }}
						>
							All international results in one place, live
							brackets, and personalized updates for fencing fans
							and athletes around the world.
						</motion.p>

						<motion.div
							className="flex flex-col gap-3 relative z-10"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8, duration: 0.6 }}
						>
							<Button
								size="lg"
								variant="secondary"
								asChild
								className="group hover:scale-105 transition-transform duration-200"
							>
								<Link href={router.home}>
									Explore
									<ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Why Section */}
			<section className="w-full py-16 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6 mx-auto">
					<motion.div
						className="flex flex-col items-center justify-center space-y-8"
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
					>
						<motion.div
							className="space-y-6 max-w-[800px]   "
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-extrabold sm:text-4xl uppercase tracking-tight">
								Why?
							</h2>
							<p className="text-lg md:text-xl   leading-relaxed">
								Many sports have dedicated apps for results and
								live scores, such as OneFootball, FotMob,
								SofaScore, TNNS Live, Flashscore, and others. I
								wanted to provide a similar experience for
								fencing, with a focus on the fan perspective and
								all scores in one place.
							</p>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Current Features Section */}
			<section className="w-full py-16 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6 mx-auto">
					<motion.div
						className="flex flex-col items-center justify-center space-y-12"
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
					>
						<motion.div
							className="space-y-6 max-w-[800px]   "
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-extrabold sm:text-4xl uppercase tracking-tight">
								What's Currently Available
							</h2>
						</motion.div>

						<motion.div
							className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
							variants={staggerContainer}
						>
							<motion.div variants={scaleIn}>
								<Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
									<CardContent className="p-0">
										<div className="flex items-start space-x-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<Trophy className="w-5 h-5 text-primary" />
											</div>
											<p className="text-sm  ">
												Live results from the second day
												of individual events from
												Fencing Time Live.
											</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div variants={scaleIn}>
								<Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
									<CardContent className="p-0">
										<div className="flex items-start space-x-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<Users className="w-5 h-5 text-primary" />
											</div>
											<p className="text-sm  ">
												Head-to-head between two fencers
												from a bout that is about to
												happen.
											</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div variants={scaleIn}>
								<Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
									<CardContent className="p-0">
										<div className="flex items-start space-x-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<Calendar className="w-5 h-5 text-primary" />
											</div>
											<p className="text-sm  ">
												Browse competitions and see
												results for all past individual
												events in the international
												circuit from the 24-25 season.
											</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Coming Soon Section */}
			<section className="w-full py-16 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6 mx-auto">
					<motion.div
						className="flex flex-col items-center justify-center space-y-12"
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
					>
						<motion.div
							className="space-y-6 max-w-[800px]   "
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-extrabold sm:text-4xl uppercase tracking-tight">
								What's Next
							</h2>
						</motion.div>

						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
							variants={staggerContainer}
						>
							{[
								{
									description:
										"Find links to the livestream for each competition.",
									icon: Eye,
								},
								{
									description:
										"Live results from Engarde and Fencing Worldwide.",
									icon: Zap,
								},
								{
									description: "Past and live team results.",
									icon: Users,
								},
								{
									description: "Results from past seasons.",
									icon: Calendar,
								},
								{
									description:
										"Follow a particular weapon, fencer, or team.",
									icon: Trophy,
								},
							].map((feature, index) => (
								<motion.div key={index} variants={scaleIn}>
									<Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/20">
										<CardContent className="p-0">
											<div className="flex items-center space-x-3">
												<div className="bg-primary/10 p-2 rounded-lg">
													<feature.icon className="w-5 h-5 text-primary" />
												</div>
												<p className="text-sm  ">
													{feature.description}
												</p>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
