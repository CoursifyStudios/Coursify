import { NextPage } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const ColoredPill: NextPage<{
	color?: "blue" | "green" | "purple" | "red" | "yellow" | "orange" | string;
	children: ReactNode;
	hoverState?: boolean;
}> = ({ color, children, hoverState }) => {
	//I'm aware that safelisting exists
	const tailwind =
		"bg-blue-200 text-blue-600 bg-green-200 text-green-600 bg-purple-200 text-purple-600 bg-red-200 text-red-600 bg-yellow-200 text-yellow-600 bg-orange-200 text-orange-600 bg-blue-200 text-blue-600";

	return (
		<div
			className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold transition duration-300 bg-${color}-200 text-${color}-600 ${
				hoverState && "hover:brightness-95"
			}`}
		>
			{children}
		</div>
	);
};
