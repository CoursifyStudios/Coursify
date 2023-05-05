import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { Fragment } from "react";
import { ReactNode } from "react";

export const Popup: NextPage<{
	open: boolean;
	closeMenu: () => void;
	children: ReactNode;
	small?: boolean;
}> = ({ closeMenu, open, children, small = false }) => {
	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog open={open} onClose={closeMenu}>
				<Transition.Child
					enter="ease-out transition"
					enterFrom="opacity-75"
					enterTo="opacity-100 scale-100"
					leave="ease-in transition"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-75"
					as={Fragment}
				>
					<div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4">
						<Transition.Child
							enter="ease-out transition"
							enterFrom="opacity-75 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in transition"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-75 scale-95"
							as={Fragment}
						>
							<Dialog.Panel
								className={`relative flex w-full ${
									small ? "max-w-screen-sm" : "max-w-screen-md"
								} flex-col rounded-xl bg-white/75 p-4 shadow-md backdrop-blur-xl`}
							>
								{children}
								<button
									onClick={closeMenu}
									className="absolute right-4 top-4 rounded p-0.5 text-gray-700 transition hover:bg-gray-300 hover:text-gray-900 focus:outline-none"
								>
									<XMarkIcon className="h-5 w-5" />
								</button>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
};
