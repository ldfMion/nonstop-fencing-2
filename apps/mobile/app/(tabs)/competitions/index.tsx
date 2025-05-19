import { FlatList, ScrollView, View, Image, Modal } from "react-native";

import { useState } from "react";
import { H2, H3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export default function TabOneScreen() {
	const [showFilters, setShowFilters] = useState(false);
	return (
		<>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				className="p-6"
			>
				<View className="flex flex-row justify-between mb-4">
					<H2 className="border-b-0">Upcoming</H2>
					<Button
						onPress={() => {
							setShowFilters(true);
						}}
					>
						<Text>Filter</Text>
					</Button>
				</View>
				<View className="flex flex-col gap-2 mb-4">
					{COMPETITIONS.map((c, index) => (
						<CompetitionCard
							competition={c}
							key={c.title + index}
						/>
					))}
				</View>
			</ScrollView>
			<Modal
				animationType="slide"
				visible={showFilters}
				presentationStyle="pageSheet"
				onRequestClose={() => setShowFilters(false)}
				onDismiss={() => setShowFilters(false)}
			>
				<View className="p-6">
					<H3>Filter</H3>
				</View>
			</Modal>
			{/* <Drawer
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
			</Drawer> */}
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
		<Card className="">
			<CardHeader className="flex flex-row gap-2">
				<Flag code={competition.flag} />
				<View>
					<H3 className="">{competition.title}</H3>
					<Text>{competition.date}</Text>
				</View>
			</CardHeader>
			<CardFooter className="gap-1">
				{competition.tags.map(tag => (
					<Badge key={tag}>
						<Text>{tag}</Text>
					</Badge>
				))}
			</CardFooter>
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
