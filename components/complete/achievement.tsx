import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, Fragment } from "react";
import { formatDate } from "../../lib/misc/dates";
import { IconConverter, InfoPill } from "../misc/infopills";

export const Achievement = ({
	data,
	earned,
}: {
	data: {
		desc_full: string | null;
		desc_short: string | null;
		icon: string | null;
		id: string;
		name: string;
		school: string;
	};
	earned?: Date;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
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
								<Dialog.Panel className="relative w-full max-w-md rounded-xl bg-white/75 p-4 shadow-md backdrop-blur-xl">
									<section className="flex items-center">
										<div className="rounded-full bg-white p-4">
											{getIcon(data.icon)}
										</div>
										<div className="ml-4">
											<Dialog.Title className="text-lg font-bold">
												{data.name}
											</Dialog.Title>
											<Dialog.Description className="line-clamp-2 text-sm text-gray-700">
												{data.desc_short}
											</Dialog.Description>
										</div>
									</section>

									<p className="mt-4 text-sm">{data.desc_full}</p>
									{earned && (
										<div className="mt-3 flex text-xs text-gray-700">
											<h3 className="mr-1.5 font-medium">Earned:</h3>
											{formatDate(earned)}
										</div>
									)}

									<button
										onClick={() => setIsOpen(false)}
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
			<div
				className="flex cursor-pointer flex-col rounded-lg py-2 text-center transition hover:bg-gray-300"
				onClick={() => setIsOpen(true)}
			>
				<div className="mx-auto rounded-full bg-white p-4">
					{getIcon(data.icon)}
				</div>
				<h3 className="mt-2 line-clamp-2 font-bold ">{data.name}</h3>
				<h4 className="line-clamp-2 text-sm">{data.desc_short}</h4>
			</div>
		</>
	);
};

export const getIcon = (icon: string | null) => {
	if (icon == null) {
		return null;
	}
	if (["doc", "link", "chat", "calendar", "folder", "music"].includes(icon)) {
		return <IconConverter.toIcon str={icon as InfoPill["icon"]} />;
	}
	return <img className="h-5 w-5" referrerPolicy="no-referrer" src={icon} />;
};
