import { Roboto, Anton } from "next/font/google";

// export const fontSans = FontSans({
// 	subsets: ["latin"],
// 	variable: "--font-sans",
// });

export const anton = Anton({ weight: "400", subsets: ["latin"] });

export const fontSans = Roboto({
	subsets: ["latin"],
	variable: "--font-sans",
});
