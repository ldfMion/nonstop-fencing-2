export default function EventsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="mx-auto px-4 max-w-xl">{children}</div>;
}
