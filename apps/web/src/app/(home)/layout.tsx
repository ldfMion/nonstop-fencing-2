import { LandingPageSections } from "../about/sections";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}
			<div className="rounded-t-xl overflow-clip">
				<LandingPageSections />
			</div>
		</>
	);
}
