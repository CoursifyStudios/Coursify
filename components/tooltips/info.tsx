import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { ReactNode, useState } from "react";

export const Info: NextPage<{ children: ReactNode; className?: string }> = ({
	children,
	className,
}) => {
	return (
		<div className="group relative cursor-pointer select-none ">
			<div
				className={`${className} grid h-5 w-5 place-items-center rounded-full bg-gray-200 text-sm`}
			>
				?
			</div>
			<div className="absolute left-0 right-0 mt-2 flex justify-center brightness-105">
				<div
					className={`min-w-[16rem] scale-90 rounded bg-white p-2 text-center text-xs font-normal opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100`}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
