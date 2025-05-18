import { Stack } from "expo-router";

export default function CompetitionsLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: "Competitions",
					headerLargeTitle: true,
					headerLargeTitleShadowVisible: false,
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
}
