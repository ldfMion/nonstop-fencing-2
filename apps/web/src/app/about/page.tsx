import { Metadata } from "next";
import { LandingPageSections } from "./sections";

export default function Home() {
	return (
		<main className="">
			<LandingPageSections />
		</main>
	);
}

export const metadata: Metadata = {
	title: "About | Nonstop Fencing",
};
