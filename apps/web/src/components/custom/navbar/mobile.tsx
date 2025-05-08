"use client";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

export function MobileNavbar() {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-row items-center justify-between py-4 md:hidden">
			<Link href="/">
				<h1 className="text-xl font-extrabold">
					<span className="text-primary">nonstop</span>fencing
				</h1>
			</Link>
			<div className="flex flex-row flex-nowrap items-center gap-2">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<MenuIcon />
					</SheetTrigger>
					<SheetContent className="overflow-y-scroll p-10">
						<NavigationMenu>
							<NavigationMenuList className="flex flex-col items-start">
								<MobileBaseLink
									href="/about"
									title="About"
									onOpenChange={setOpen}
								/>
								<MobileBaseLink
									href="events"
									title="Events"
									onOpenChange={setOpen}
								/>
								<MobileBaseLink
									href="/"
									title="Rankings"
									onOpenChange={setOpen}
								/>
							</NavigationMenuList>
						</NavigationMenu>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}

function MobileBaseLink({
	href,
	title,
	onOpenChange,
}: {
	href: string;
	title: string;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<MobileLink onOpenChange={onOpenChange}>
			<NavigationMenuItem>
				<Link
					href={href}
					passHref
					className={cn(
						buttonVariants({ variant: "link" }),
						"p-0 text-lg text-foreground"
					)}
				>
					{title}
				</Link>
			</NavigationMenuItem>
		</MobileLink>
	);
}

function MobileLink({
	onOpenChange,
	children,
}: {
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}) {
	return <div onClick={() => onOpenChange(false)}>{children}</div>;
}
