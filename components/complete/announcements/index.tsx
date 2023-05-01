import { Listbox, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
	deleteAnnouncement,
	removeAnnouncementFromCommunity,
} from "../../../lib/db/announcements";
import { Database, Json } from "../../../lib/db/database.types";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import { howLongAgo } from "../../../lib/misc/dates";
import { useTabs } from "../../../lib/tabs/handleTabs";
import Editor from "../../editors/richeditor";
import { ConfirmDialog } from "../../misc/confirmDialog";
import { AnnouncementPostingUI } from "./announcementPosting";

/**
 * editing announcements
 *  editing state for annoucnement posting
 * Need the ui to update on announcement deletion & for posting
 */
export const Announcement = ({
	announcement,
	classID,
}: {
	announcement: {
		author: string;
		content: Json;
		id: string;
		time: string | null;
		title: string | null;
		users:
			| {
					avatar_url: string;
					full_name: string;
			  }
			| {
					avatar_url: string;
					full_name: string;
			  }[]
			| null;
	};
	classID: string;
}) => {
	const supabase = useSupabaseClient<Database>();
	const user = useUser();
	const { newTab } = useTabs();
	//add icons to these somehow...
	const options = [
		{ option: "Share" }, //some sort of share icon
		{ option: "Edit" }, //Pencil Icon
		{ option: "Delete From This Group" }, //trashcan icon
		{ option: "Delete From All Groups" }, //trashcan icon
	];
	const [selected, setSelected] = useState(options[0]);
	const [showEditing, setShowEditing] = useState(false);
	const [showRemoveFromGroup, setShowRemoveFromGroup] = useState(false);
	const [showDeleteAnnouncement, setShowDeleteAnnouncement] = useState(false);
	const [deleted, setDeleted] = useState(false);
	if (!deleted) {
		if (showEditing) {
			return (
				<AnnouncementPostingUI
					communityid={classID}
					editingInfo={{
						title: announcement.title!,
						content: announcement.content,
						time: announcement.time!,
					}}
					setEditing={setShowEditing}
				></AnnouncementPostingUI>
			);
		}
		return (
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
							<Listbox.Button className="flex w-36 rounded-lg bg-gray-200 py-2 pl-3 pr-10 text-sm">
								<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
									<EllipsisVerticalIcon className="h-6 w-6" />
								</span>
							</Listbox.Button>
							<Transition
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options className="absolute -right-5 top-0 z-10 mt-2 flex max-h-60 w-max flex-col overflow-auto rounded-xl bg-white p-1.5 text-sm shadow-xl backdrop-blur-xl transition">
									{options.map(
										(options, optionID) =>
											user &&
											(user.id == announcement.author ||
												options.option == "Share") && (
												<Listbox.Option
													key={optionID}
													className={({ active }) =>
														`my-0.5 flex w-48 select-none justify-center rounded-md px-2 py-0.5 transition ${
															active ? "bg-gray-200" : "text-gray-900"
														}`
													}
													value={options}
													onClick={() => {
														if (
															options.option == "Delete From This Group" &&
															selected
														) {
															setShowRemoveFromGroup(true);
														} else if (
															options.option == "Delete From All Groups" &&
															selected
														) {
															setShowDeleteAnnouncement(true);
														} else if (options.option == "Edit" && selected) {
															setShowEditing(true);
														}
													}}
													as="button"
												>
													{({ selected }) => {
														return (
															<>
																<span className="font-semibold">
																	{options.option}
																</span>
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
				{/* <div className="mt-4 flex items-center justify-between">
				<div className="mr-24 flex-grow items-center rounded-full bg-gray-300 p-1">
					<p className="ml-1.5 p-1">Insert response here</p>
				</div>
				<div className="rounded-full bg-gray-300 p-2">
					<FaceSmileIcon className="h-6 w-6" />
				</div>
			</div> */}
				<ConfirmDialog
					show={showRemoveFromGroup}
					setShow={setShowRemoveFromGroup}
					onConfirm={async () => {
						const test = await removeAnnouncementFromCommunity(
							supabase,
							announcement.id,
							classID
						);
						setDeleted(true);
					}}
					text="Are you sure you would like to remove this announcement from this group? This action cannot be undone."
				></ConfirmDialog>
				<ConfirmDialog
					show={showDeleteAnnouncement}
					setShow={setShowDeleteAnnouncement}
					// props={} try this
					onConfirm={async () => {
						const test = await deleteAnnouncement(supabase, {
							author: announcement.author,
							title: announcement.title!,
							time: announcement.time!,
						});
						setDeleted(true);
					}}
					text="Are you sure you would like to remove this announcement from all groups? This action cannot be undone."
				></ConfirmDialog>
			</div>
		);
	} else {
		return null;
	}
};
