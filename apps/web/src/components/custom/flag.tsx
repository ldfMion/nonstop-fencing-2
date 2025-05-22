import { cn } from "~/lib/utils";
import Image from "next/image";

export function Flag({
	flagCode,
	className,
}: { flagCode?: string } & React.ComponentProps<"div">) {
	return flagCode && flagCode != "--" ? (
		<div
			className={cn(
				"overflow-hidden rounded-sm border flex-shrink-0",
				className
			)}
		>
			<Image
				src={`https://flagcdn.com/w1280/${flagCode.toLowerCase()}.png`}
				alt={`${flagCode} flag`}
				className="w-full h-full object-cover"
				height={400}
				width={400}
			/>
		</div>
	) : null;
}
