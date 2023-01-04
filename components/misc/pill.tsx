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
		case "light green":
			pillColor = "bg-green-100 text-green-500";
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

/**
 *
 * @param icon Use an svg with a width and height of 5 magical tailwind units (techicanlly 5/4ths of a rem)
 * @param to (optional) link of where you want it to go when clicked
 * @param className extra
 * @returns
 */

export const ButtonIcon: NextPage<{
	icon: ReactNode;
	to?: string;
	className?: string;
}> = ({ icon, to, className }) => {
	const r = (
		<div
			className={
				"grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-gray-300 text-gray-800 transition  duration-300 hover:brightness-95 " +
				className
			}
		>
			{icon}
		</div>
	);

	// allows for wrapping it in a component
	if (to) {
		return <Link href={to}>{r}</Link>;
	} else {
		return r;
	}
};
