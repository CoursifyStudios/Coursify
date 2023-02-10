import { NextPage } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const Button: NextPage<{ className: string }> = ({ className }) => {
	return (
		<div
			className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${className} text-lg font-semibold `}
		>
			Members
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