import { NextPage } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const Button: NextPage<{
	className?: string;
	children: ReactNode;
	color?: string;
	disabled?: boolean;
	onClick?: () => void;
	type?: "submit" | "reset" | "button";
}> = ({ className, children, color, disabled, onClick, type }) => {
	return (
		<button
			disabled={disabled}
			className={`flex cursor-pointer items-center rounded-md px-4 py-1 font-semibold focus:outline-none ${className} focus:outline-none ${
				color ? color : "bg-gray-200"
			} ${disabled ? "cursor-not-allowed brightness-75" : "brightness-hover"}`}
			onClick={onClick}
			type={type}
		>
			{children}
		</button>
	);
};

/**
 *
 * @param icon Use an svg with a width and height of 5 magical tailwind units (technically 5/4ths of a rem)
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
				"grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-gray-300 text-gray-800 transition duration-300 hover:brightness-95  compact:h-8 compact:w-8 " +
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
