import { FlatList } from "react-native";

import { Heading } from "@/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/card";
import { Image } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";

export default function TabOneScreen() {
	return (
		<SafeAreaView className="px-6 flex flex-col gap-4">
			<Heading size="2xl">Competitions</Heading>
			<FlatList
				data={COMPETITIONS}
				renderItem={({ item }) => (
					<Card className="mb-2 flex flex-row gap-4 rounded-3xl p-4">
						<VStack space="sm">
							<HStack space="sm">
								<Flag code={item.flag} />
								<VStack>
									<Heading className="">{item.title}</Heading>
									<Text>{item.date}</Text>
								</VStack>
							</HStack>
							<HStack space="sm">
								{item.tags.map(tag => (
									<Badge key={tag}>
										<BadgeText>{tag}</BadgeText>
									</Badge>
								))}
							</HStack>
						</VStack>
					</Card>
				)}
				className=""
			/>
		</SafeAreaView>
	);
}

export function Flag({ code }: { code: string }) {
	return (
		<Image
			// source={`https://flagcdn.com/w1280/${code.toLowerCase()}.png`}
			source={{
				uri: `https://flagcdn.com/w1280/${code.toLowerCase()}.png`,
			}}
			className="h-14 w-20 rounded-xl"
		/>
	);
}

const COMPETITIONS = [
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
	{
		title: "Bogota Grand Prix",
		date: "May 11 - May 11, 2025",
		flag: "co",
		tags: ["MEN", "WOMEN", "EPEE", "INDIVIDUAL"],
	},
];
