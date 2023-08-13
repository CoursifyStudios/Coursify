import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "../../lib/misc/dates";
import { IconConverter, InfoPill } from "../misc/infopills";
import { Popup } from "../misc/popup";

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
	const [open, setOpen] = useState(false);
	return (
		<>
			<Popup closeMenu={() => setOpen(false)} open={open} size="sm">
				<section className="w-full flex items-center">
					<div className="w-full rounded-full bg-backdrop p-4">
						{getIcon(data.icon)}
					</div>
					<div className="w-full ml-4">
						<Dialog.Title className="w-full text-lg font-bold">
							{data.name}
						</Dialog.Title>
						<Dialog.Description className="w-full line-clamp-2 text-sm text-gray-700">
							{data.desc_short}
						</Dialog.Description>
					</div>
				</section>

				<p className="w-full mt-4 text-sm">{data.desc_full}</p>
				{earned && (
					<div className="w-full mt-3 flex text-xs text-gray-700">
						<h3 className="w-full mr-1.5 font-medium">Awarded:</h3>
						{formatDate(earned)}
					</div>
				)}

				<button
					onClick={() => setOpen(false)}
					className="w-full absolute right-4 top-4 rounded p-0.5 text-gray-700 transition hover:bg-gray-300 hover:text-gray-900 focus:outline-none"
				>
					<XMarkIcon className="w-full h-5 w-5" />
				</button>
			</Popup>
			<div
				className="w-full flex cursor-pointer flex-col rounded-lg py-2 text-center transition hover:bg-gray-300"
				onClick={() => setOpen(true)}
			>
				<div className="w-full mx-auto rounded-full bg-backdrop p-4 text-white">
					{getIcon(data.icon)}
				</div>
				<h3 className="w-full mt-2 line-clamp-2 font-bold ">{data.name}</h3>
				<h4 className="w-full line-clamp-2 text-sm">{data.desc_short}</h4>
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
	return (
		<Image
			className="w-full h-5 w-5"
			referrerPolicy="no-referrer"
			src={icon}
			alt="icon"
			width={20}
			height={20}
		/>
	);
};
