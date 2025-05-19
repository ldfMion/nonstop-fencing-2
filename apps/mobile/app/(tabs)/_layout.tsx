import React from "react";
import { Tabs } from "expo-router";
import { Trophy } from "@/lib/icons/Trophy";
import { Star } from "@/lib/icons/Star";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="competitions"
				options={{
					title: "Competitions",
					tabBarIcon: ({ color }) => <Trophy color={color} />,
				}}
			/>
			<Tabs.Screen
				name="following"
				options={{
					title: "Following",
					tabBarIcon: ({ color }) => <Star color={color} />,
				}}
			/>
		</Tabs>
	);
}
