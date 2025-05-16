import { FilterDrawer } from "./filter-drawer";
import { SideFilter } from "./side-filter";

export function Filter() {
	return (
		<>
			<div className="md:hidden">
				<FilterDrawer />
			</div>
			<div className="hidden md:block">
				<SideFilter />
			</div>
		</>
	);
}
