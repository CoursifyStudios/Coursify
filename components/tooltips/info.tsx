import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { ReactNode, useState } from "react";

export const Info: NextPage<{
	children: ReactNode;
	className?: string;
	size?: "small" | "large";
}> = ({ children, className, size = "large" }) => {
	return (
		<div className="group relative cursor-pointer select-none ">
			<div
				className={`${className} grid h-4 w-4 place-items-center rounded-full bg-gray-200 text-xs font-medium`}
			>
				?
			</div>
			<div className="absolute left-0 right-0 z-30 mt-2 flex justify-center">
				<div
					className={`${
						size == "large" ? "min-w-[16rem]" : "min-w-[8rem]"
					} hidden rounded border border-transparent bg-backdrop/75 p-2 text-center text-xs font-normal opacity-0 shadow-lg backdrop-blur-xl transition group-hover:block group-hover:opacity-100 dark:border-gray-300`}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
