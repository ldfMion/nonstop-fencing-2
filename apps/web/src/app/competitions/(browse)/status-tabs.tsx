"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Card } from "~/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

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
		<Card className="md:hidden p-2 mt-2">
			<ToggleGroup value={active} className=" w-full" type="single">
				<Link href={linkTo("previous")} className="w-full" passHref>
					<ToggleGroupItem value="previous" className="w-full">
						Past
					</ToggleGroupItem>
				</Link>
				<Link href={linkTo("upcoming")} className="w-full" passHref>
					<ToggleGroupItem value="upcoming" className="w-full">
						Upcoming
					</ToggleGroupItem>
				</Link>
			</ToggleGroup>
		</Card>
	);
}
