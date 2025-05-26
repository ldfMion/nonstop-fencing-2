import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FeatureCards } from "./feature-cards";
import { router } from "~/lib/router";
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
