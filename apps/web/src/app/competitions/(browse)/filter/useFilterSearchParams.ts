// hooks/useFilterSearchParams.ts
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useFilterSearchParams() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Helper function to update search params
	// Memoized with useCallback for stability
	const updateSearchParams = useCallback(
		(key: string, value: string | string[]) => {
			const params = new URLSearchParams(searchParams.toString()); // Preserve existing params

			// Ensure value is not null or undefined before checking length/emptiness
			if (value !== null && value !== undefined) {
				if (Array.isArray(value)) {
					// For multiple select (arrays)
					if (value.length > 0) {
						params.set(key, value.join(","));
					} else {
						params.delete(key);
					}
				} else {
					// For single select
					if (value !== "") {
						params.set(key, value);
					} else {
						params.delete(key);
					}
				}
			} else {
				params.delete(key);
			}

			// Use router.push for client-side navigation
			// Using pathname ensures we don't accidentally change the route itself
			router.push(`?${params.toString()}`, { scroll: false }); // scroll: false is often desired for filter changes
		},
		[searchParams, router] // Dependencies for useCallback
	);

	// Handlers for ToggleGroup changes, using schema keys and values
	// Memoized with useCallback
	const handleWeaponChange = useCallback(
		(value: string) => {
			updateSearchParams("weapon", value);
		},
		[updateSearchParams]
	);

	const handleGenderChange = useCallback(
		(value: string) => {
			updateSearchParams("gender", value);
		},
		[updateSearchParams]
	);

	const handleTypeChange = useCallback(
		(value: string) => {
			updateSearchParams("type", value);
		},
		[updateSearchParams]
	);

	const handleStatusChange = useCallback(
		(value: string) => {
			updateSearchParams("status", value);
		},
		[updateSearchParams]
	);

	// Memoized with useCallback
	const handleResetFilters = useCallback(() => {
		const params = new URLSearchParams(); // Start with empty params
		router.push(`?${params.toString()}`, { scroll: false }); // scroll: false
	}, [router]);

	// Get current values from search params based on schema keys
	// These will re-evaluate whenever searchParams changes
	const currentGender = searchParams.get("gender") || "";
	const currentWeapon = searchParams.get("weapon") || "";
	const currentType = searchParams.get("type") || "";
	const currentStatus = searchParams.get("status") || "";

	// Determine if any filters are active
	const active = Boolean(
		currentGender || currentWeapon || currentType || currentStatus
	);

	return {
		// Current values
		currentWeapon,
		currentGender,
		currentType,
		currentStatus,
		active,
		// Handlers
		handleWeaponChange,
		handleGenderChange,
		handleTypeChange,
		handleStatusChange,
		handleResetFilters,
	};
}
