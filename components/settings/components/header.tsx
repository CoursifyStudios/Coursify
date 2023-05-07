import { LinkIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode } from "react";

/**
 *
 * @param
 * @returns A header component
 */

export const Header: NextPage<{
	page: number;
	name: string;
	children: ReactNode;
}> = ({ children, name, page }) => {
	const router = useRouter();

	return (
		<div
			className="group mb-2 flex cursor-pointer items-center pb-2 [&:not(:first-child)]:mt-14"
			id={name}
			onClick={() =>
				router.push(
					{
						pathname: "/settings",
						query: { page, category: name },
						//hash: `#${name}`
					},
					{
						pathname: "/settings",
						query: { page, category: name },
					},
					{ scroll: false }
				)
			}
		>
			<h3 className="title-sm">{children}</h3>
			<LinkIcon className="ml-1 mr-1 h-4 w-4 text-gray-600 opacity-0 transition group-hover:opacity-100 dark:text-gray-400" />
			<div className="h-0.5 grow rounded-full bg-gray-200"></div>
		</div>
	);
};
