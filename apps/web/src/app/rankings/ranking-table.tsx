import { Badge } from "~/components/ui/badge";
import { Flag } from "~/components/custom/flag";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

export type RankingData = {
	points: string;
	position: number;
	flag?: string;
	fencer?: {
		firstName: string;
		lastName: string;
		id: number;
	};
	team?: {
		name: string;
		id: string;
	};
} & (
	| {
			fencer: {
				firstName: string;
				lastName: string;
				id: number;
			};
	  }
	| {
			team: {
				name: string;
				id: string;
			};
	  }
);

export function RankingTable({
	data,
	showHeader,
	showPoints,
}: {
	data: RankingData[];
	showHeader: boolean;
	showPoints: boolean;
}) {
	return (
		<Table className="table-fixed w-full">
			{showHeader && (
				<TableHeader className="bg-muted">
					<TableRow className="px-3">
						<TableHead className="w-16 text-center font-semibold">
							Rank
						</TableHead>
						<TableHead className="font-semibold">Fencer</TableHead>
						{showPoints && (
							<TableHead className="text-right font-semibold w-24">
								Points
							</TableHead>
						)}
					</TableRow>
				</TableHeader>
			)}
			<TableBody>
				{data.map(ranking => (
					<TableRow
						key={ranking.fencer?.id || ranking.team?.id}
						className=""
					>
						<TableCell className="text-center">
							<div className="flex items-center justify-center gap-2">
								<PositionBadge position={ranking.position} />
							</div>
						</TableCell>
						<TableCell>
							<div className="flex items-center gap-3 w-full">
								{ranking.flag && (
									<Flag
										flagCode={ranking.flag}
										className="w-6 h-4 rounded-[6px] flex-shrink-0"
									/>
								)}
								<p className="capitalize !truncate w-full">
									<span className="font-bold text-foreground">
										{ranking.fencer &&
											ranking.fencer.lastName + ","}
										{ranking.team && ranking.team.name}
									</span>{" "}
									{ranking.fencer && (
										<span className="text-foreground">
											{ranking.fencer.firstName}
										</span>
									)}
								</p>
							</div>
						</TableCell>
						{showPoints && (
							<TableCell className="text-right">
								<Badge
									variant="secondary"
									className="font-mono font-semibold text-sm"
								>
									{ranking.points}
								</Badge>
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
function PositionBadge({ position }: { position: number }) {
	let className;
	switch (position) {
		case 1:
			className = "bg-yellow-200 text-yellow-800 border-yellow-500";
			break;
		case 2:
			className = "bg-slate-200 text-slate-800 border-slate-500";
			break;
		case 3:
			className = "bg-orange-200 text-orange-800 border-orange-500";
			break;
		default:
			className = "";
	}
	return (
		<Badge
			variant={position <= 16 ? "default" : "outline"}
			className={cn(
				"w-8 h-8 rounded-full flex items-center justify-center p-0 text-sm font-semibold",
				className
			)}
		>
			{position}
		</Badge>
	);
}
