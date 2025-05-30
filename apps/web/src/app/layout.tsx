// import type { Metadata } from "next";
import "~/globals.css";
import { fontSans, anton } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import Navbar from "~/components/custom/navbar";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ReactQueryClientProvider } from "./rq-provider";
import { Footer } from "./footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
	title: "Home | Nonstop Fencing",
	description:
		"Follow fencing like never before with Nonstop Fencing. Access all international results in one place, live brackets, and personalized updates for fencing fans and athletes around the world. Upgrading the fencing fan experience.",
	robots: "index, follow",
	keywords:
		"fencing, live results, fencing competitions, brackets, fencing fans, international fencing, olympic fencing, fencing results, fencing world cup, fencing grand prix, fencing world championships",
	openGraph: {
		title: "Nonstop Fencing | About",
		description:
			"Follow fencing like never before with Nonstop Fencing. Access all international results in one place, live brackets, and personalized updates for fencing fans and athletes around the world. Upgrading the fencing fan experience.",
		url: "https://nonstopfencing.com",
		siteName: "Nonstop Fencing",
		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ReactQueryClientProvider>
			<html lang="en">
				<body
					className={cn(
						"min-h-screen bg-gray-100/50 font-sans antialiased font-",
						fontSans.variable,
						anton.variable
					)}
				>
					<Navbar />
					{children}
					<Footer />
					<Analytics />
					<SpeedInsights />
				</body>
			</html>
		</ReactQueryClientProvider>
	);
}
