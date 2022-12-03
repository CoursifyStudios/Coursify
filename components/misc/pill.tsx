import { NextPage } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const ColoredPill: NextPage<{
	color?: "blue" | "green" | "purple" | "red" | "yellow" | "orange" | string;
	children: ReactNode;
}> = ({ color, children }) => {
	let pillColor;
	switch (color) {
		case "blue":
			pillColor = "bg-blue-200 text-blue-600";
			break;
		case "green":
			pillColor = "bg-green-200 text-green-600";
			break;
		case "purple":
			pillColor = "bg-purple-200 text-purple-600";
			break;
		case "red":
			pillColor = "bg-red-200 text-red-600";
			break;
		case "yellow":
			pillColor = "bg-yellow-200 text-yellow-600";
			break;
		case "orange":
			pillColor = "bg-orange-200 text-orange-600";
			break;
		default:
			pillColor = "bg-blue-200 text-blue-600";
			break;
	}

	return (
		<div
			className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold ${pillColor}`}
		>
			{children}
		</div>
	);
};
