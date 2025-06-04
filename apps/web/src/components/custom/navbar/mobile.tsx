"use client";
import { BarChart3, Info, MenuIcon, Trophy } from "lucide-react";
import Link from "next/link";
import { JSX, useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { router } from "~/lib/router";

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
						<SheetTitle className="hidden">
							Mobile Navigation
						</SheetTitle>
						<NavigationMenu>
							<NavigationMenuList className="flex flex-col items-start">
								<MobileBaseLink
									href={router.about}
									title="About"
									onOpenChange={setOpen}
									// icon={<Info />}
								/>
								<MobileBaseLink
									href={router.competitions()}
									title="Competitions"
									onOpenChange={setOpen}
									// icon={<Trophy />}
								/>
								<MobileBaseLink
									href={router.rankings}
									title="Rankings"
									onOpenChange={setOpen}
								/>
								<MobileBaseLink
									href={router.home}
									title="Home"
									onOpenChange={setOpen}
									// icon={<BarChart3 />}
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
	icon,
}: {
	href: string;
	title: string;
	onOpenChange: (open: boolean) => void;
	icon?: JSX.Element;
}) {
	return (
		<MobileLink onOpenChange={onOpenChange}>
			<NavigationMenuItem>
				<Link
					href={href}
					className={cn(
						buttonVariants({ variant: "link" }),
						"p-0 text-lg text-foreground"
					)}
				>
					{icon} {title}
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
