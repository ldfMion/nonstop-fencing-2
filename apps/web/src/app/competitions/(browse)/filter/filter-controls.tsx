// components/FilterControls.tsx
"use client";

import { Separator } from "~/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useFilterSearchParams } from "./useFilterSearchParams";
import { Button } from "~/components/ui/button"; // Optional: include reset button here or in parent

export function FilterControls({
	// Optional: Pass a prop to control if the Reset button is shown internally
	showResetButton = false,
}: {
	showResetButton?: boolean;
}) {
	const {
		currentWeapon,
		currentGender,
		currentType,
		currentStatus,
		handleWeaponChange,
		handleGenderChange,
		handleTypeChange,
		handleStatusChange,
		handleResetFilters, // Get the reset handler from the hook
	} = useFilterSearchParams();

	return (
		<div className="flex flex-col gap-4">
			{/* Weapon Filter - Assuming single select based on schema */}
			<div>
				{/* Added a label for clarity */}
				<ToggleGroup
					type="single"
					variant="outline"
					value={currentWeapon}
					onValueChange={handleWeaponChange}
				>
					<ToggleGroupItem value="foil">Foil</ToggleGroupItem>
					<ToggleGroupItem value="epee">Epee</ToggleGroupItem>
					<ToggleGroupItem value="saber">Saber</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<Separator />

			{/* Gender Filter - Assuming single select based on schema */}
			<div>
				<ToggleGroup
					variant="outline"
					type="single"
					value={currentGender}
					onValueChange={handleGenderChange}
				>
					<ToggleGroupItem value="men">{"Men's"}</ToggleGroupItem>
					<ToggleGroupItem value="women">{"Women's"}</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<Separator />

			{/* Type Filter - Assuming single select based on schema */}
			<div>
				<ToggleGroup
					variant="outline"
					type="single"
					value={currentType}
					onValueChange={handleTypeChange}
				>
					<ToggleGroupItem value="individual">
						Individual
					</ToggleGroupItem>
					<ToggleGroupItem value="team">Team</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<Separator />

			{/* Status Filter - Assuming single select based on schema */}
			<div>
				<ToggleGroup
					variant="outline"
					type="single"
					value={currentStatus}
					onValueChange={handleStatusChange}
				>
					<ToggleGroupItem value="previous">Past</ToggleGroupItem>
					<ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
				</ToggleGroup>
			</div>

			{/* Optional internal reset button */}
			{showResetButton && (
				<Button variant="outline" onClick={handleResetFilters}>
					Reset Filters
				</Button>
			)}
		</div>
	);
}
