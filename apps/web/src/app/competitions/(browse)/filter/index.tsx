import { Suspense } from "react";
import { FilterDrawer } from "./filter-drawer";
import { SideFilter } from "./side-filter";

export function Filter() {
	return (
		<Suspense>
			<div className="md:hidden">
				<FilterDrawer />
			</div>
			<div className="hidden md:block">
				<SideFilter />
			</div>
		</Suspense>
	);
}
