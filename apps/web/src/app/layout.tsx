// import type { Metadata } from "next";
import "~/globals.css";
import { fontSans, anton } from "~/lib/fonts";
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
					"min-h-screen bg-gray-100 font-sans antialiased font-",
					fontSans.variable,
					anton.variable
				)}
			>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
