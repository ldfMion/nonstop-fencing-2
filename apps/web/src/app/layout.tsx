import type { Metadata } from "next";
import "./globals.css";
import { fontSans } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import Navbar from "~/components/custom/navbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
