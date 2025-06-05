import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Calendar, Info, ListOrdered } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "~/components/ui/carousel";
import { router } from "~/lib/router";
import { cn } from "~/lib/utils";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<MobileTopNav />
			{children}
		</>
	);
}

function MobileTopNav() {
	return (
		<nav className="flex flex-row gap-2 md:hidden pt-4 jutify-start w-full overflow-x-scroll">
			<Link
				href={router.competitions()}
				className={cn(buttonVariants({ variant: "default" }), "ml-4")}
			>
				<Calendar />
				Browse Competitions
			</Link>
			<Link
				className={buttonVariants({ variant: "default" })}
				href={router.rankings}
			>
				<ListOrdered />
				View Rankings
			</Link>
			<Link
				className={cn(buttonVariants({ variant: "default" }), "mr-4")}
				href={router.about}
			>
				<Info />
				About Us
			</Link>
		</nav>
	);
}
