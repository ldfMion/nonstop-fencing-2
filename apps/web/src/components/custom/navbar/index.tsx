import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { MobileNavbar } from "./mobile";

export default function Navbar() {
	return (
		<div className="sticky top-0 z-10 px-6 backdrop-blur-md">
			<DesktopNavbar />
			<MobileNavbar />
		</div>
	);
}

function DesktopNavbar() {
	return (
		<div className="hidden flex-row justify-between py-6 md:flex">
			<Link href="/">
				<h1 className="text-2xl font-extrabold">
					<span className="text-primary">nonstop</span>fencing
				</h1>
			</Link>
			<NavigationMenu>
				<NavigationMenuList className="flex flex-row gap-2">
					<NavigationMenuItem>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link href="/">Rankings</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link href="">Events</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link href="/about">About Us</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
