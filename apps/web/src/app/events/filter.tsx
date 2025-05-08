import { Filter as FilterIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export function Filter() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">
					Filter
					<FilterIcon className="" />
				</Button>
			</SheetTrigger>
			<SheetContent side="bottom">
				<SheetHeader>
					<SheetTitle className="text-2xl">
						Filter Competitions
					</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col px-6 gap-4">
					{/* Weapon Filter */}

					<ToggleGroup
						type="multiple"
						variant="outline"
						// value={localOptions.weapons}
						// onValueChange={handleWeaponChange}
					>
						<ToggleGroupItem value="FOIL">Foil</ToggleGroupItem>
						<ToggleGroupItem value="EPEE">Epee</ToggleGroupItem>
						<ToggleGroupItem value="SABER">Saber</ToggleGroupItem>
					</ToggleGroup>

					<Separator />

					{/* Gender Filter */}

					<ToggleGroup
						variant="outline"
						type="multiple"
						// value={localOptions.gender}
						// onValueChange={handleGenderChange}
					>
						<ToggleGroupItem value="MEN">Men's</ToggleGroupItem>
						<ToggleGroupItem value="WOMEN">Women's</ToggleGroupItem>
					</ToggleGroup>

					<Separator />

					{/* Type Filter */}

					<ToggleGroup
						variant="outline"
						type="multiple"
						// value={localOptions.type}
						// onValueChange={handleTypeChange}
					>
						<ToggleGroupItem value="INDIVIDUAL">
							Individual
						</ToggleGroupItem>
						<ToggleGroupItem value="TEAM">Team</ToggleGroupItem>
					</ToggleGroup>

					<Separator />

					{/* Timing Filter */}
					<ToggleGroup
						variant="outline"
						type="single"
						// value={localOptions.timing}
						// onValueChange={handleTimingChange}
					>
						<ToggleGroupItem value="past">Past</ToggleGroupItem>
						<ToggleGroupItem value="upcoming">
							Upcoming
						</ToggleGroupItem>
						<ToggleGroupItem value="">All</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button>Done</Button>
					</SheetClose>
					<Button variant="outline">Reset</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
