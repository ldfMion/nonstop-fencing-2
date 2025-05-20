import { JSX } from "react";
import { Alert, AlertTitle } from "~/components/ui/alert";

export function PageMessage({
	children,
	icon,
}: {
	children: string;
	icon?: JSX.Element;
}) {
	return (
		<div className="p-6">
			<Alert className="">
				{icon}
				<AlertTitle>{children}</AlertTitle>
			</Alert>
		</div>
	);
}
