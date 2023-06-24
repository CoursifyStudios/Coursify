// deno-lint-file
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, ReactNode } from "react";

export default function CMenu({
	children,
	items,
}: {
	children: ReactNode;
	items: {
		content: ReactNode;
		onClick?: () => void;
		link?: string;
		className?: string;
	}[];
}) {
	return (
		<Menu className="relative !ml-4 flex w-10 flex-col items-center" as="div">
			<Menu.Button>{children}</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom=" opacity-0 scale-95 translate-x-1 -translate-y-2"
				enterTo=" opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom=" opacity-100 scale-100"
				leaveTo=" opacity-0 scale-95 translate-x-1 -translate-y-2"
			>
				<div className="absolute right-0 z-50 mt-14">
					<Menu.Items
						as="div"
						className="flex w-48 flex-col  rounded-xl bg-gray-200/75 px-2 py-2 shadow-xl backdrop-blur-xl"
					>
						{items.map((item, i) => {
							const menuItem = (
								<Menu.Item
									as="button"
									className={`${item.className} flex items-center justify-between rounded-lg px-2 py-1 font-medium transition hover:bg-gray-300`}
									onClick={item.onClick}
								>
									{item.content}
								</Menu.Item>
							);

							if (item.link) {
								return (
									<Link href={item.link} key={i}>
										{menuItem}
									</Link>
								);
							}
							return menuItem;
						})}
					</Menu.Items>
				</div>
			</Transition>
		</Menu>
	);
}
