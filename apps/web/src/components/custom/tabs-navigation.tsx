"use client";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePathname } from "next/navigation";

export function TabsNavigation({
	subpages,
}: {
	subpages: { url: string; title: string }[];
}) {
	const path = usePathname();
	const active = subpages.filter(page => path.includes(page.url))[0]!.url;
	return (
		<Tabs value={active} className="">
			<TabsList className="">
				{subpages.map(page => (
					<Tab
						key={page.url}
						value={page.url}
						url={`${page.url}`}
						title={page.title}
					/>
				))}
			</TabsList>
		</Tabs>
	);
}

function Tab({
	url,
	title,
	value,
}: {
	url: string;
	title: string;
	value: string;
}) {
	return (
		<TabsTrigger value={value} key={title}>
			<Link href={url}>{title}</Link>
		</TabsTrigger>
	);
}
