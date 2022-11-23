import { NextPage } from "next";
import type { ReactNode } from "react";

export const ColoredPill: NextPage<{ color?: "blue"; children: ReactNode }> = ({
	color,
	children,
}) => {
	let pillColor;
	switch (color) {
		case "blue":
			pillColor = "bg-blue-200 text-blue-600";
			break;
		default:
			pillColor = "bg-blue-200 text-blue-600";
			break;
	}

	return (
		<div
			className={`inline-flex rounded-full px-2 py-0.5 text-sm font-medium  ${pillColor}`}
		>
			{children}
		</div>
	);
};
