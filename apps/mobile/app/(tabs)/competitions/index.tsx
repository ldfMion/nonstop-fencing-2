import { FlatList, ScrollView } from "react-native";

import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Image } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { useState } from "react";
import {
	Drawer,
	DrawerBackdrop,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
} from "@/components/ui/drawer";

export default function TabOneScreen() {
	const [showDrawer, setShowDrawer] = useState(false);
	return (
		<>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				className="p-6"
			>
				<HStack className="flex flex-row justify-between items-center mb-4">
					<Heading>Upcoming</Heading>
					<Button
						size="sm"
						onPress={() => {
							setShowDrawer(true);
						}}
					>
						<ButtonText>Filter</ButtonText>
					</Button>
				</HStack>
				{COMPETITIONS.map((c, index) => (
					<CompetitionCard competition={c} key={c.title + index} />
				))}
			</ScrollView>
			<Drawer
				isOpen={showDrawer}
				onClose={() => {
					setShowDrawer(false);
				}}
				size=""
				anchor="bottom"
			>
				<DrawerBackdrop />
				<DrawerContent>
					<DrawerHeader>
						<Heading size="3xl">Filter</Heading>
					</DrawerHeader>
					<DrawerBody>
						<Text size="2xl" className="text-typography-800">
							This is a sentence.
						</Text>
					</DrawerBody>
					<DrawerFooter>
						<Button
							onPress={() => {
								setShowDrawer(false);
							}}
							className="flex-1"
						>
							<ButtonText>Button</ButtonText>
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
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

function CompetitionCard({
	competition,
}: {
	competition: (typeof COMPETITIONS)[0];
}) {
	return (
		<Card className="mb-2 flex flex-row gap-4 rounded-3xl p-4">
			<VStack space="sm">
				<HStack space="sm">
					<Flag code={competition.flag} />
					<VStack>
						<Heading className="">{competition.title}</Heading>
						<Text>{competition.date}</Text>
					</VStack>
				</HStack>
				<HStack space="sm">
					{competition.tags.map(tag => (
						<Badge key={tag}>
							<BadgeText>{tag}</BadgeText>
						</Badge>
					))}
				</HStack>
			</VStack>
		</Card>
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
