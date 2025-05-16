"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function StatusTabs() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const active = searchParams.get("status") ?? "previous";
	function linkTo(value: "previous" | "upcoming") {
		const current = new URLSearchParams(searchParams.toString());
		current.set("status", value);
		return `${pathname}?${current.toString()}`;
	}
	return (
		<Tabs value={active} className="md:hidden w-full">
			<TabsList className="w-full">
				<Link href={linkTo("previous")} className="w-full">
					<TabsTrigger value="previous" className="w-full">
						Past
					</TabsTrigger>
				</Link>
				<Link href={linkTo("upcoming")} className="w-full">
					<TabsTrigger value="upcoming" className="w-full">
						Upcoming
					</TabsTrigger>
				</Link>
			</TabsList>
		</Tabs>
	);
}
