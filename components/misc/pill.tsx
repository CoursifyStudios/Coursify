import { NextPage } from "next";
import { ReactNode, useState } from "react";

export const ColoredPill: NextPage<{
	color?:
		| "blue"
		| "green"
		| "purple"
		| "red"
		| "yellow"
		| "orange"
		| "gray"
		| string;
	children: ReactNode;
	hoverState?: boolean;
	className?: string;
}> = ({ color, children, hoverState, className }) => {
	const tailwind =
		//I'm aware that safelisting exists tyvm
		`bg-blue-200 text-blue-600 bg-green-200 text-green-600 bg-purple-200 text-purple-600 bg-red-200 text-red-600 bg-yellow-200 text-yellow-600 bg-orange-200 text-orange-600 bg-blue-200 text-blue-600 |||| 
		text-blue-300  text-green-300  text-purple-300 text-red-300 text-yellow-300 text-orange-300 text-blue-300 |||| text-blue-500 text-green-500 text-purple-500 text-red-500 text-yellow-500 text-orange-500 
		text-blue-500 text-green-500 text-purple-500 text-red-500 text-yellow-500 text-orange-500 ||| border-blue-500 border-green-500 border-purple-500 border-red-500 border-yellow-500 border-orange-500 border-blue-500 
		border-green-500 border-purple-500 border-red-500 border-yellow-500 border-orange-500


		`;

	return (
		<div
			className={`inline-flex shrink-0 select-none rounded-full px-2.5 py-0.5 text-sm font-semibold transition duration-300 bg-${color}-200 border-opacity-20 dark:bg-opacity-10 text-${color}-600 ${
				color == "gray" && "!bg-gray-300 !text-gray-700 "
			} ${hoverState && "hover:brightness-95"} ${className}`}
		>
			{children}
		</div>
	);
};

export const CopiedHover: NextPage<{ children: ReactNode; copy: string }> = ({
	children,
	copy,
}) => {
	const [copied, setCopied] = useState(false);
	const [copiedHover, setCopiedHover] = useState(false);
	return (
		<div
			className="group relative cursor-pointer select-none "
			onClick={() => (
				navigator.clipboard.writeText(copy),
				setCopied(true),
				setTimeout(() => {
					//Show for 700 seconds until exiting hover thing
					setCopiedHover(false);
					setTimeout(() => {
						//Change text back once scale animation is over
						setCopied(false);
					}, 150);
				}, 700)
			)}
			onMouseEnter={() => setCopiedHover(true)}
			onMouseLeave={() => setCopiedHover(false)}
		>
			{children}
			<div className="absolute left-0 right-0 mt-2 flex justify-center brightness-105">
				<div
					className={`min-w-[6rem] scale-0 rounded transition-all ${
						copied ? "bg-gray-300" : "bg-gray-300"
					} px-2  py-0.5 text-center text-sm font-medium shadow-lg transition ${
						copiedHover && "scale-100"
					}`}
				>
					{copied ? "Copied!" : "Copy Link"}
				</div>
			</div>
		</div>
	);
};
