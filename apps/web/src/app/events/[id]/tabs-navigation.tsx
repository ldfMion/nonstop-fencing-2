"use client";
import { useSelectedLayoutSegment, useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

const subpages: { url: string; title: string }[] = [
	{ url: "", title: "Overview" },
	{ url: "bracket", title: "Bracket" },
	{ url: "results", title: "Results" },
];

export function TabsNavigation() {
	const segment = useSelectedLayoutSegment();
	const active = segment ?? "";
	const { id } = useParams<{ id: string }>();
	return (
		<Tabs value={active} className="">
			<TabsList className="">
				{subpages.map(page => (
					<Tab
						key={page.url}
						value={page.url}
						url={`${id}/${page.url}`}
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
