import { LinkIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export const Header: NextPage<{
	page: number;
	name: string;
	children: ReactNode;
}> = ({ children, name, page }) => {
	const router = useRouter();

	return (
		<div
			className="group mb-4 flex cursor-pointer items-center pb-2"
			id={name}
			onClick={() =>
				router.push(
					{
						pathname: "/settings",
						query: { page, category: name },
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
			<LinkIcon className="invisible ml-2 h-5 w-5 text-gray-600 group-hover:visible dark:text-gray-400" />
		</div>
	);
};
