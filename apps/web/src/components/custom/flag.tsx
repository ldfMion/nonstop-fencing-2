import { cn } from "~/lib/utils";
import Image from "next/image";

export function Flag({
	flagCode,
	className,
}: { flagCode?: string } & React.ComponentProps<"div">) {
	return flagCode ? (
		<div
			className={cn(
				"overflow-hidden rounded-sm border flex-shrink-0",
				className
			)}
		>
			<Image
				src={resolveFlagUrl(flagCode)}
				alt={`${flagCode} flag`}
				className="w-full h-full object-cover"
				height={400}
				width={400}
			/>
		</div>
	) : null;
}

function resolveFlagUrl(flagCode: string) {
	if (flagCode == "TW") {
		return "/taipei.png";
	}
	if (flagCode == "--") {
		return "/ain.png";
	}
	return `https://flagcdn.com/w1280/${flagCode.toLowerCase()}.png`;
}
