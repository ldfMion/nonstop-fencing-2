// components/FilterDrawer.tsx
"use client";

import { Filter as FilterIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { FilterControls } from "./filter-controls"; // Import the reusable component
import { useFilterSearchParams } from "./useFilterSearchParams"; // Import the hook

export function FilterDrawer() {
	// Use the hook to get the active state and the reset handler
	const { active, handleResetFilters } = useFilterSearchParams();

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant={active ? "default" : "outline"}>
					Filter
					<FilterIcon className="ml-2 h-4 w-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="">
				<DrawerHeader>
					<DrawerTitle className="text-2xl">
						Filter Competitions
					</DrawerTitle>
				</DrawerHeader>
				<div className="flex flex-col px-6 gap-4 py-4">
					{/* Use the reusable filter controls component */}
					<FilterControls showResetButton={false} />{" "}
					{/* We'll put the reset button in the footer */}
				</div>
				<DrawerFooter className="p-6 flex flex-col sm:flex-row sm:justify-end gap-2">
					{/* The Reset button calls the handler from the hook */}
					<Button variant="outline" onClick={handleResetFilters}>
						Reset
					</Button>
					<DrawerClose asChild>
						<Button>Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
