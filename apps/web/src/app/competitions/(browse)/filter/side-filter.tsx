"use client";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { FilterControls } from "./filter-controls";
import { useFilterSearchParams } from "./useFilterSearchParams";
import { Button } from "~/components/ui/button";

export function SideFilter() {
	const { active, handleResetFilters } = useFilterSearchParams();
	return (
		<Card className="">
			<CardHeader>
				<CardTitle>Filter</CardTitle>
			</CardHeader>
			<CardContent>
				<FilterControls />
			</CardContent>
			<CardFooter className="justify-end">
				<Button disabled={!active} onClick={handleResetFilters}>
					Reset
				</Button>
			</CardFooter>
		</Card>
	);
}
