import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { MobileNavbar } from "./mobile";
import { router } from "~/lib/router";
import { ReactNode } from "react";
import Image from "next/image";

export default function Navbar() {
	return (
		<div className="sticky top-0 z-20 px-6 backdrop-blur-xl bg-card border-b-1">
			<DesktopNavbar />
			<MobileNavbar />
		</div>
	);
}

function DesktopNavbar() {
	return (
		<div className="hidden flex-row justify-between py-2 md:flex">
			<Link
				href="/"
				className="flex flex-row items-center hover:opacity-70"
			>
				<Image
					src="/logo.png"
					width={50}
					height={50}
					alt="logo"
					className="rounded-full aspect-square"
				/>
				<h1 className="text-2xl font-extrabold ">
					<span className="text-primary">nonstop</span>
					fencing
				</h1>
			</Link>
			<NavigationMenu>
				<NavigationMenuList className="flex flex-row gap-2">
					<DesktopBaseLink href={router.competitions()}>
						Competitions
					</DesktopBaseLink>
					<DesktopBaseLink href={router.rankings}>
						Rankings
					</DesktopBaseLink>
					<DesktopBaseLink href={router.about}>About</DesktopBaseLink>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}

function DesktopBaseLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<NavigationMenuItem>
			<Link href={href} className={navigationMenuTriggerStyle()}>
				{children}
			</Link>
		</NavigationMenuItem>
	);
}
