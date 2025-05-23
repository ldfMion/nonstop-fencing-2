import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { router } from "~/lib/router";

export function Footer() {
	return (
		<footer className="w-full border-t bg-background">
			<div className="container px-4 md:px-24 py-8 mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="flex flex-col space-y-4">
						<Link href="/" className="flex items-center">
							<h3 className="text-xl font-extrabold">
								<span className="text-primary">nonstop</span>
								fencing
							</h3>
						</Link>
						<p className="text-sm text-muted-foreground">
							All international fencing results in one place, live
							brackets, and personalized updates.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Navigation</h4>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-sm"
									asChild
								>
									<Link href={router.competitions()}>
										Competitions
									</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-sm"
									asChild
								>
									<Link href={router.about}>About</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-sm"
									asChild
								>
									<Link href={router.home}>Home</Link>
								</Button>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t text-sm text-muted-foreground">
					© {new Date().getFullYear()} nonstopfencing. All rights
					reserved.
				</div>
			</div>
		</footer>
	);
}
