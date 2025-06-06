import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";

export function CustomCard({
	headerContent,
	content,
	link,
}: {
	headerContent: React.ReactNode;
	content: React.ReactNode;
	link?: string;
}) {
	return (
		<Card className="shadow-xs rounded-xl p-0 gap-0 overflow-clip">
			{link ? (
				<Link href={link} className="w-full">
					<CardHeader className="flex flex-row justify-between w-full p-4 bg-muted hover:bg-accent">
						{headerContent}
						<ChevronRight />
					</CardHeader>
				</Link>
			) : (
				<CardHeader className="flex flex-row justify-between w-full p-4 bg-muted">
					{headerContent}
				</CardHeader>
			)}
			<Separator />
			<CardContent>{content}</CardContent>
		</Card>
	);
}
