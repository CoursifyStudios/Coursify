import { Listbox, Transition } from "@headlessui/react";
import {
	EllipsisVerticalIcon,
	PencilIcon,
	ShareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { TypeOfAnnouncements } from "../../../lib/db/announcements";
import { Database } from "../../../lib/db/database.types";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import { howLongAgo } from "../../../lib/misc/dates";
import { useTabs } from "../../../lib/tabs/handleTabs";
import Editor from "../../editors/richeditor";
import { AnnouncementPostingUI } from "./announcementPosting";
import { TempAnnouncement } from "./tempAnnouncement";
import { Delete } from "./delete";
import { Commenting } from "./commenting";

/**
 * editing announcements
 *  editing state for annoucnement posting
 * Need the ui to update on announcement deletion & for posting
 */
export const Announcement = ({
	announcement,
	classID,
	announcements,
	setAnnouncements,
}: {
	announcement: TypeOfAnnouncements;
	classID: string;
	announcements: TypeOfAnnouncements[];
	setAnnouncements: (value: TypeOfAnnouncements[]) => void;
}) => {
	const supabase = useSupabaseClient<Database>();
	const user = useUser();
	const { newTab } = useTabs();
	//add icons to these somehow...
	const optionsClasses = "w-4 h-4 ml-1";
	const options = [
		{ option: "Share", icon: <ShareIcon className={optionsClasses} /> },
		{ option: "Edit", icon: <PencilIcon className={optionsClasses} /> },
		{ option: "Delete", icon: <TrashIcon className={optionsClasses} /> },
	];
	const [selected, setSelected] = useState(options[0]);
	const [showEditing, setShowEditing] = useState(false);
	const [showSharing, setShowSharing] = useState(false);
	const [showDeleting, setShowDeleting] = useState(false);
	const [deleted, setDeleted] = useState(false);
	if (!deleted) {
		if (showEditing) {
			return (
				<AnnouncementPostingUI
					communityid={classID}
					sharingInfo={null}
					editingInfo={{
						title: announcement.title!,
						content: announcement.content,
						time: announcement.time!,
						setEditing: setShowEditing,
					}}
					announcements={announcements}
					setAnnouncements={setAnnouncements}
				></AnnouncementPostingUI>
			);
		} else if (showSharing) {
			return (
				<AnnouncementPostingUI
					communityid={classID}
					sharingInfo={{
						announcement: announcement,
						setSharing: setShowSharing,
					}}
					announcements={announcements}
					setAnnouncements={setAnnouncements}
				></AnnouncementPostingUI>
			);
		}
		return (
			<>
				<Delete
					open={showDeleting}
					setOpen={setShowDeleting}
					setDeleted={setDeleted}
					supabase={supabase}
					announcement={announcement}
					classID={classID}
				/>
				<div className="rounded-xl bg-gray-200 p-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">{announcement.title}</h2>
						<Listbox
							value={selected}
							onChange={setSelected}
							as="div"
							className="font-semibold"
						>
							<div className="relative">
								<Listbox.Button className="flex rounded-md px-0.5 py-0.5 transition hover:bg-gray-300">
									<EllipsisVerticalIcon className="h-6 w-6" />
								</Listbox.Button>
								<Transition
									as={Fragment}
									enter="transition ease-in-out duration-300"
									enterFrom="scale-95 opacity-0"
									enterTo="scale-100 opacity-100"
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<Listbox.Options className="absolute right-0 top-6 z-10 mt-2 flex w-28 flex-col overflow-auto rounded-xl bg-white/75 p-1.5 text-sm shadow-xl backdrop-blur-xl transition">
										{options.map(
											(options, optionID) =>
												user &&
												(user.id == announcement.author ||
													options.option == "Share") && (
													<Listbox.Option
														key={optionID}
														className={({ active }) =>
															`my-0.5 flex select-none items-center justify-between rounded-md px-4 py-1 transition ${
																active ? "bg-gray-200" : "text-gray-900"
															}`
														}
														value={options}
														onClick={() => {
															switch (options.option) {
																case "Share":
																	setShowSharing(true);
																	break;
																case "Edit":
																	setShowEditing(true);
																	break;
																default:
																	setShowDeleting(true);
															}
														}}
														as="button"
													>
														{({ selected }) => {
															return (
																<>
																	{options.option}
																	{options.icon}
																</>
															);
														}}
													</Listbox.Option>
												)
										)}
									</Listbox.Options>
								</Transition>
							</div>
						</Listbox>
					</div>
					<div className="flex items-center pt-1">
						<Link
							href={"/profile/" + announcement.author}
							className="inline-flex shrink-0 items-center rounded-full px-1 py-0.5 hover:bg-gray-300"
							onClick={() =>
								newTab(
									"/profile/" + announcement.author,
									getDataOutArray(announcement.users!).full_name.split(" ")[0] +
										"'s Profile"
								)
							}
						>
							<img
								src={getDataOutArray(announcement.users!).avatar_url}
								alt=""
								className="h-5 w-5 rounded-full"
							/>
							<p className="ml-1.5 mr-1 font-semibold text-neutral-700">
								{getDataOutArray(announcement.users!).full_name}
							</p>
						</Link>
						<p className="pl-1.5 text-gray-600">
							{howLongAgo(announcement.time!)}
						</p>
					</div>
					<Editor
						editable={false}
						initialState={announcement.content}
						className="mt-0.5"
					/>
					{announcement.parent && (
						<div className="flex">
							<div className="ml-1 mr-3 flex w-2 flex-shrink-0 bg-slate-400 p-1"></div>
							<TempAnnouncement
								announcement={announcement.parent}
							></TempAnnouncement>
						</div>
					)}
					<Commenting
						communityid={classID}
						announcementid={announcement.id}
					></Commenting>
				</div>
			</>
		);
	} else {
		return null;
	}
};
