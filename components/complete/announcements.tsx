import { Dialog, Transition } from "@headlessui/react";
import {
	CheckCircleIcon,
	EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { EditorState } from "lexical";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { crossPostAnnouncements } from "../../lib/db/announcements";
import { Database, Json } from "../../lib/db/database.types";
import { getDataOutArray } from "../../lib/misc/dataOutArray";
import { howLongAgo } from "../../lib/misc/dates";
import { useTabs } from "../../lib/tabs/handleTabs";
import Editor from "../editors/richeditor";
import { Button } from "../misc/button";
import Loading from "../misc/loading";
import { ColoredPill } from "../misc/pill";
import { getClassesForUserBasic } from "../../lib/db/classes";

export const Announcement = ({
	announcement,
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
}) => {
	const { newTab } = useTabs();
	return (
		<div className="rounded-xl bg-gray-200 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{announcement.title}</h2>
				<EllipsisVerticalIcon className="h-6 w-6" />
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
				<p className="pl-1.5 text-gray-600">{howLongAgo(announcement.time!)}</p>
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
		</div>
	);
};

export const AnnouncementPostingUI = ({
	communityid,
	prevRefreshState,
	refreshAnnouncements,
}: {
	communityid: string;
	prevRefreshState: boolean;
	refreshAnnouncements: (value: boolean) => void;
}) => {
	const supabase = useSupabaseClient<Database>();
	const [showPost, setShowPost] = useState(false);
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState<EditorState>();
	const [showLoading, setShowLoading] = useState(false);
	const [communities, setCommunities] = useState<
		{ id: string; name: string }[]
	>([]);
	const [chosenCommunities, setChosenCommunities] = useState<
		{ id: string; name: string }[]
	>([
		{
			id: communityid,
			name: "",
		},
	]);
	const [showCrossPosting, setShowCrossPosting] = useState(false);

	const user = useUser();

	const FormObserver: React.FC = () => {
		const { values } = useFormikContext();

		useEffect(() => {
			setTitle((values as { title: string }).title);
		}, [values]);

		return null;
	};

	async function getCommunities() {
		if (user && communities.length == 0) {
			const dbResponse = await getClassesForUserBasic(supabase, user.id);
			const classes: { id: string; name: string }[] = [];
			if (dbResponse.data) {
				dbResponse.data.map((basicClassInfo) => {
					if (
						(basicClassInfo.classes && basicClassInfo.teacher) ||
						getDataOutArray(basicClassInfo.classes)?.type == 1
					) {
						classes.push({
							id: getDataOutArray(basicClassInfo.classes)!.id,
							name: getDataOutArray(basicClassInfo.classes)!.name,
						});
					}
				});
				setCommunities(classes);
			}
		}
	}

	if (!showLoading) {
		if (!showPost)
			return (
				<div
					className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-solid hover:bg-gray-50"
					onClick={() => setShowPost(true)}
				>
					<h3 className="mb-4 font-semibold">New Announcement</h3>

					<div className="h-10 w-96 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
						Enter a title...
					</div>
					<div className="mt-4 h-10 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
						Description...
					</div>
				</div>
			);

		return (
			<div className="flex flex-col  rounded-xl border-2  border-gray-300 bg-gray-50 p-4">
				<h3 className="mb-4 font-semibold">New Announcement</h3>
				<Formik
					initialValues={{
						title: "",
					}}
					onSubmit={() => {}}
				>
					<Form className="flex flex-col">
						<label
							htmlFor="title"
							className="flex flex-col text-sm font-medium"
						>
							<Field
								name="title"
								type="text"
								className="h-10 w-96 rounded border-gray-300 bg-white py-1.5 pl-3 text-lg font-normal placeholder:text-gray-700 focus:ring-1"
								autoFocus
							></Field>
						</label>
						<ErrorMessage name="title"></ErrorMessage>

						<FormObserver />
					</Form>
				</Formik>
				<Editor
					editable={true}
					className="my-4 rounded border border-gray-300 bg-white p-2"
					updateState={setEditorState}
					focus={false}
				/>

				<div className="mb-4 flex flex-wrap gap-4">
					{chosenCommunities && chosenCommunities.length > 1 &&
						chosenCommunities.map(
							(chosenCommunity) =>
								chosenCommunity &&
								chosenCommunity.id != communityid && (
									<ColoredPill key={chosenCommunity.id} color="gray">
										{chosenCommunity.name}
									</ColoredPill>
								)
						)}
				</div>

				<div className="flex justify-between space-x-4">
					<Button
						className="mr-auto"
						onClick={async () => {
							getCommunities();
							setShowCrossPosting(true);
						}}
					>
						Post to other groups...
					</Button>
					<div className="flex space-x-4">
						<Button
							className="brightness-hover transition hover:bg-red-300"
							onClick={() => {
								setChosenCommunities([
									{
										id: communityid,
										name: "",
									},
								]);
								setShowPost(false);
							}}
						>
							Cancel
						</Button>
						<Button
							className="text-white"
							color="bg-blue-500"
							onClick={async () => {
								if (!isEditorEmpty(editorState) && !(title.length == 0)) {
									setShowLoading(true); //change below later
									const testing = await crossPostAnnouncements(
										supabase,
										user?.id!,
										title,
										editorState?.toJSON() as unknown as Json,
										chosenCommunities.map(({ id }) => id)
									);
									if (testing) setShowLoading(false);
									setChosenCommunities([
										{
											id: communityid,
											name: "",
										},
									]);
									refreshAnnouncements(!prevRefreshState);
								}
							}}
							disabled={isEditorEmpty(editorState) || title.length == 0}
						>
							Post
						</Button>
					</div>
				</div>
				{communities && (
					<CommunityPicker
						chosenCommunities={chosenCommunities}
						communities={communities}
						setChosenCommunities={setChosenCommunities}
						setShowCrossPosting={setShowCrossPosting}
						showCrossPosting={showCrossPosting}
						communityid={communityid}
					/>
				)}
			</div>
		);
	} else {
		return <Loading className="flex" />;
	}
};

const CommunityPicker = ({
	chosenCommunities,
	communities,
	setShowCrossPosting,
	showCrossPosting,
	setChosenCommunities,
	communityid,
}: {
	showCrossPosting: boolean;
	setShowCrossPosting: Dispatch<SetStateAction<boolean>>;
	communities: { id: string; name: string }[];
	chosenCommunities: { id: string; name: string }[];
	setChosenCommunities: Dispatch<
		SetStateAction<{ id: string; name: string }[]>
	>;
	communityid: string;
}) => {
	return (
		<Transition appear show={showCrossPosting} as={Fragment}>
			<Dialog
				open={showCrossPosting}
				onClose={() => setShowCrossPosting(false)}
			>
				<Transition.Child
					enter="ease-out transition"
					enterFrom="opacity-75"
					enterTo="opacity-100 scale-100"
					leave="ease-in transition"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-75"
					as={Fragment}
				>
					<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-4">
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
								<h2 className="mb-5 text-lg font-medium">Select Groups...</h2>
								<div className="h- grid grid-cols-2 gap-2">
									{communities.length != 0
										? communities.map((community) => {
												const isChosen = Boolean(
													chosenCommunities.find((c) => c.id == community.id)
												);
												if (community.id == communityid) return null;
												return (
													<button
														key={community.id}
														className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left font-medium ${
															isChosen
																? "brightness-hover bg-gray-200"
																: "hover:bg-gray-200"
														} focus:outline-none`}
														onClick={() => {
															addOrRemoveCommunity(community, !isChosen);
														}}
													>
														<p className="truncate">{community.name}</p>
														{isChosen ? (
															<CheckCircleIcon className="ml-2 h-5 w-5 min-w-[1.25rem] text-gray-700" />
														) : (
															<div className="w-7" />
														)}
													</button>
												);
										  })
										: [...new Array(6)].map((_, i) => (
												<div
													key={i}
													className="h-12 animate-pulse rounded-lg bg-gray-200"
												/>
										  ))}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);

	function addOrRemoveCommunity(
		community: { id: string; name: string },
		trueIfAdd: boolean
	) {
		if (trueIfAdd) {
			setChosenCommunities((communities) => communities.concat([community]));
		} else if (!trueIfAdd) {
			setChosenCommunities((communities) =>
				communities.filter((c) => c.id != community.id)
			);
		}
	}
};

function isEditorEmpty(editor: EditorState | undefined) {
	if (editor) return editor.toJSON().root.direction === null;
	return true;
}
