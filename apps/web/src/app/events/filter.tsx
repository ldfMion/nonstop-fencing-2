"use client";
import { Filter as FilterIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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
	const router = useRouter();
	const searchParams = useSearchParams();

	// Helper function to update search params
	const updateSearchParams = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString()); // Preserve existing params

		if (value && (Array.isArray(value) ? value.length > 0 : value !== "")) {
			// For multiple select (arrays)
			if (Array.isArray(value)) {
				params.set(key, value.join(","));
			} else {
				// For single select
				params.set(key, value);
			}
		} else {
			params.delete(key);
		}

		// Navigate to the new URL with updated params
		router.push(`?${params.toString()}`);
	};

	// Handlers for ToggleGroup changes, using schema keys and values
	const handleWeaponChange = (value: string) => {
		updateSearchParams("weapon", value);
	};

	const handleGenderChange = (value: string) => {
		updateSearchParams("gender", value);
	};

	const handleTypeChange = (value: string) => {
		updateSearchParams("type", value);
	};

	const handleStatusChange = (value: string) => {
		// Renamed from handleTimingChange to handleStatusChange
		updateSearchParams("status", value); // Using 'status' as per schema
	};

	const handleResetFilters = () => {
		const params = new URLSearchParams(); // Start with empty params
		router.push(`?${params.toString()}`);
	};

	// Get current values from search params based on schema keys
	const currentGender = searchParams.get("gender") || ""; // Gender is single select in schema
	const currentWeapon = searchParams.get("weapon") || ""; // Weapon is single select in schema
	const currentType = searchParams.get("type") || ""; // Type is single select in schema
	const currentStatus = searchParams.get("status") || ""; // Status is single select in schema

	// Note: Your schema defines weapon, gender, and type as singular literals,
	// suggesting they might be single-select filters. However, your ToggleGroup
	// components for weapon, gender, and type are currently set to `type="multiple"`.
	// I've updated the logic to handle them as single select based on your schema,
	// but if they are intended to be multiple select, you'll need to adjust
	// the schema and the code accordingly (splitting comma-separated values).
	// For now, assuming single select based on the provided schema literals.
	// If they are multiple, change the `|| ''` to `?.split(',') || []` and
	// the ToggleGroup type to "multiple".
	const active = !(!currentGender && !currentWeapon && !currentType);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant={active ? "default" : "outline"}>
					Filter
					<FilterIcon className="ml-2 h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="max-h-[90vh] overflow-y-auto"
			>
				<SheetHeader>
					<SheetTitle className="text-2xl">
						Filter Competitions
					</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col px-6 gap-4 py-4">
					{/* Weapon Filter - Assuming single select based on schema */}
					<div>
						<h3 className="text-lg font-semibold mb-2">Weapon</h3>
						<ToggleGroup
							type="single" // Changed to single based on schema
							variant="outline"
							value={currentWeapon}
							onValueChange={handleWeaponChange}
						>
							<ToggleGroupItem value="foil">Foil</ToggleGroupItem>{" "}
							{/* Lowercase value */}
							<ToggleGroupItem value="epee">
								Epee
							</ToggleGroupItem>{" "}
							{/* Lowercase value */}
							<ToggleGroupItem value="saber">
								Saber
							</ToggleGroupItem>{" "}
							{/* Lowercase value */}
						</ToggleGroup>
					</div>

					<Separator />

					{/* Gender Filter - Assuming single select based on schema */}
					<div>
						<h3 className="text-lg font-semibold mb-2">Gender</h3>
						<ToggleGroup
							variant="outline"
							type="single" // Changed to single based on schema
							value={currentGender}
							onValueChange={handleGenderChange}
						>
							<ToggleGroupItem value="men">Men's</ToggleGroupItem>{" "}
							{/* Lowercase value */}
							<ToggleGroupItem value="women">
								Women's
							</ToggleGroupItem>{" "}
							{/* Lowercase value */}
						</ToggleGroup>
					</div>

					<Separator />

					{/* Type Filter - Assuming single select based on schema */}
					<div>
						<h3 className="text-lg font-semibold mb-2">Type</h3>
						<ToggleGroup
							variant="outline"
							type="single" // Changed to single based on schema
							value={currentType}
							onValueChange={handleTypeChange}
						>
							<ToggleGroupItem value="individual">
								{" "}
								{/* Lowercase value */}
								Individual
							</ToggleGroupItem>
							<ToggleGroupItem value="team">
								Team
							</ToggleGroupItem>{" "}
							{/* Lowercase value */}
						</ToggleGroup>
					</div>

					<Separator />

					{/* Status Filter - Assuming single select based on schema */}
					<div>
						<h3 className="text-lg font-semibold mb-2">Status</h3>{" "}
						{/* Changed heading */}
						<ToggleGroup
							variant="outline"
							type="single"
							value={currentStatus}
							onValueChange={handleStatusChange}
						>
							<ToggleGroupItem value="previous">
								Past
							</ToggleGroupItem>{" "}
							{/* Changed value and text */}
							<ToggleGroupItem value="upcoming">
								Upcoming
							</ToggleGroupItem>
							{/* Removed "All" ToggleGroupItem as schema doesn't define it */}
						</ToggleGroup>
					</div>
				</div>
				<SheetFooter className="p-6 flex flex-col sm:flex-row sm:justify-end gap-2">
					<Button variant="outline" onClick={handleResetFilters}>
						Reset
					</Button>
					<SheetClose asChild>
						<Button>Done</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
