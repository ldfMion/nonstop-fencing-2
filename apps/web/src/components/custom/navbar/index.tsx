import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { MobileNavbar } from "./mobile";
import { router } from "~/lib/router";

export default function Navbar() {
	return (
		<div className="sticky top-0 z-20 px-6 backdrop-blur-xl">
			<DesktopNavbar />
			<MobileNavbar />
		</div>
	);
}

function DesktopNavbar() {
	return (
		<div className="hidden flex-row justify-between py-6 md:flex">
			<Link href="/">
				<h1 className="text-2xl anton tracking-wide">
					<span className="text-primary">nonstop</span>
					fencing
				</h1>
			</Link>
			<NavigationMenu>
				<NavigationMenuList className="flex flex-row gap-2">
					<DesktopBaseLink href={router.home}>
						Rankings
					</DesktopBaseLink>
					<DesktopBaseLink href={router.competitions()}>
						Competitions
					</DesktopBaseLink>
					<DesktopBaseLink href={router.home}>About</DesktopBaseLink>
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
	children: string;
}) {
	return (
		<NavigationMenuItem>
			<Link href={href} className={navigationMenuTriggerStyle()}>
				{children}
			</Link>
		</NavigationMenuItem>
	);
}
