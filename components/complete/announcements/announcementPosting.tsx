import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { EditorState } from "lexical";
import { useEffect, useState } from "react";
import {
	TypeOfAnnouncements,
	editAnnouncement,
	postAnnouncements,
	shareAnnouncement,
} from "../../../lib/db/announcements";
import { getClassesForUserBasic } from "../../../lib/db/classes";
import { Database, Json } from "../../../lib/db/database.types";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import Editor from "../../editors/richeditor";
import { Button } from "../../misc/button";
import { LoadingSmall } from "../../misc/loading";
import { ColoredPill } from "../../misc/pill";
import { CommunityPicker } from "./communityPicker";
import { TempAnnouncement } from "./tempAnnouncement";
export const AnnouncementPostingUI = ({
	communityid,
	announcements,
	setAnnouncements,
	sharingInfo,
	editingInfo,
	setNewInfo,
}: {
	communityid: string;
	announcements: TypeOfAnnouncements[];
	setAnnouncements: (value: TypeOfAnnouncements[]) => void;
	sharingInfo?: {
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
			type: number;
		};
		setSharing: (value: boolean) => void;
	} | null;
	editingInfo?: {
		id: string;
		title: string;
		content: Json;
		clone_id: string | null;
		setEditing?: (value: boolean) => void;
	};
	setNewInfo?: (value: { title: string; content: Json }) => void;
	setEditing?: (value: boolean) => void;
}) => {
	const supabase = useSupabaseClient<Database>();
	const [showPosting, setShowPosting] = useState(
		editingInfo || sharingInfo ? true : false
	);
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState<EditorState>();
	const [communities, setCommunities] = useState<
		{ id: string; name: string }[]
	>([]);
	const [chosenCommunities, setChosenCommunities] = useState<
		{ id: string; name: string }[]
	>(
		sharingInfo
			? []
			: [
					{
						id: communityid,
						name: "",
					},
			  ]
	);
	const [showCrossPosting, setShowCrossPosting] = useState(false);
	const [fakeAnnouncements, setFakeAnnouncements] = useState<
		{
			author: string;
			class_id: string;
			content: Json;
			title: string;
		}[]
	>([]);
	const [showSharing, setShowSharing] = useState(false);
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
			//TODO: error handling for this
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

	return (
		<div>
			{showPosting ? (
				<div className="flex flex-col rounded-xl border-2 border-gray-300 bg-gray-50 p-4 dark:bg-zinc-950">
					{!editingInfo && !sharingInfo && (
						<h3 className="mb-4 font-semibold">New Announcement</h3>
					)}
					<Formik
						initialValues={{
							title: editingInfo ? editingInfo.title : "",
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
									className="h-10 py-1.5 pl-3 text-lg font-normal placeholder:text-gray-600 focus:ring-1 dark:placeholder:text-neutral-500"
									autoFocus
									placeholder="Enter a title..."
								></Field>
							</label>
							<ErrorMessage name="title"></ErrorMessage>
							<FormObserver />
						</Form>
					</Formik>
					<Editor
						editable={true}
						className="mt-4 rounded-md border border-gray-300 bg-backdrop/50 p-2 "
						backdrop={false}
						updateState={setEditorState}
						initialState={editingInfo && editingInfo.content}
						focus={false}
					/>
					{sharingInfo?.announcement && (
						<TempAnnouncement
							announcement={{
								author: sharingInfo.announcement.author,
								content: sharingInfo.announcement.content,
								title: sharingInfo.announcement.title as string,
								time: sharingInfo.announcement.time as string,
								users: sharingInfo.announcement.users,
							}}
						></TempAnnouncement>
					)}

					<div className="my-3 flex flex-wrap gap-4">
						{chosenCommunities &&
							chosenCommunities.length > 1 &&
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

					<div
						className={
							editingInfo
								? "flex justify-end"
								: "flex justify-between space-x-4"
						}
					>
						{!editingInfo && (
							<Button
								className="mr-auto"
								onClick={async () => {
									getCommunities();
									setShowCrossPosting(true);
								}}
							>
								{sharingInfo ? "Share to..." : "Post to other groups..."}
							</Button>
						)}
						<div className="flex space-x-4">
							<Button
								className="brightness-hover transition hover:bg-red-300 dark:hover:bg-red-900"
								onClick={() => {
									!sharingInfo &&
										setChosenCommunities([
											{
												id: communityid,
												name: "",
											},
										]);
									// If you are in sharing or editing mode, cancelling should take you back to
									// the original announcement, not the "New Announcement" UI
									sharingInfo?.setSharing
										? sharingInfo.setSharing(false)
										: setShowPosting(false);
									editingInfo?.setEditing
										? editingInfo.setEditing(false)
										: setShowPosting(false);
								}}
							>
								Cancel
							</Button>
							<Button
								className="text-white"
								color="bg-blue-500"
								onClick={async () => {
									if (user) {
										// If the user is there,
										// add a "fake announcement", filled with the new data.
										// This is a temporary measure until the data from the operation gets back.
										// All ways of modifying announcements share this behavior (with the exception of commenting),
										// so this behavior of adding a temporary announcement and hiding the posting UI is shared.

										// This does happen before we know if the request failed or not, so when it fails it will
										// be weird but it will succeed super quickly!
										!sharingInfo &&
											setFakeAnnouncements(
												fakeAnnouncements.concat({
													author: user.id,
													class_id: communityid,
													content: editorState?.toJSON() as unknown as Json,
													title: title,
												})
											);
										setShowPosting(false); //This hides the announcement posting UI.

										// If the announcement is being shared, perform the following behaviors:
										if (sharingInfo && chosenCommunities.length >= 1) {
											setShowSharing(true);
											// post it to the DB
											const sharedAnnouncement = await shareAnnouncement(
												supabase,
												sharingInfo.announcement.id,
												{
													author: user.id,
													title: title,
													content: editorState?.toJSON() as unknown as Json,
												},
												chosenCommunities.map(({ id }) => id)
											);
											if (sharedAnnouncement.error) {
												alert("Error: failed to share announcement");
											}
											setShowSharing(false);
											sharingInfo.setSharing(false);

											// here we check if we are editing the announcement, and either the title or content
											// of the edited announcement actually differs from the original one.
										} else if (
											editingInfo &&
											editingInfo.setEditing &&
											((editorState?.toJSON() as unknown as Json) !=
												editingInfo.content ||
												title != editingInfo.title)
										) {
											// This sends the edited announcement to the DB....
											const newAnnouncement = await editAnnouncement(
												supabase,
												{
													id: editingInfo.id,
													author: user.id,
													title: editingInfo.title,
													clone_id: editingInfo.clone_id,
												},
												{
													title: title,
													content: editorState?.toJSON() as unknown as Json,
												}
											);
											// ...And on its return removes the fake announcement..
											setFakeAnnouncements(
												fakeAnnouncements.filter(
													(announcement) =>
														announcement.title != editingInfo.title
												)
											);
											//and sets the real one
											if (newAnnouncement.error) {
												alert("Error: editing announcement failed");
											} else {
												setNewInfo &&
													setNewInfo({
														title: title,
														content: editorState?.toJSON() as unknown as Json,
													});
											}
											editingInfo.setEditing(false);
										} else {
											// This is for when you are neither sharing nor editing (just posting normally)
											// it just checks that both the title and contnet of the announcement are populated
											if (!isEditorEmpty(editorState) && !(title.length == 0)) {
												const dBReturn = await postAnnouncements(
													supabase,
													user?.id!,
													title,
													editorState?.toJSON() as unknown as Json,
													chosenCommunities.map(({ id }) => id)
												);
												setFakeAnnouncements(
													fakeAnnouncements.filter(
														(announcement) =>
															announcement.title != dBReturn.data![0].title
													)
												);
												if (dBReturn && dBReturn.data) {
													setAnnouncements(
														announcements.concat(
															dBReturn.data.find(
																(announcement) =>
																	announcement.class_id == communityid
															) as unknown as TypeOfAnnouncements
														)
													);
												} else {
													alert("Error: failed to post announcement");
												}

												//reset which communities to share to
												!sharingInfo &&
													setChosenCommunities([
														{
															id: communityid,
															name: "",
														},
													]);
											}
										}
									}
								}}
								disabled={
									(isEditorEmpty(editorState) && !sharingInfo) ||
									(sharingInfo && chosenCommunities.length == 0) ||
									title.length == 0
								}
							>
								{editingInfo ? "Save" : "Post"}
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
			) : (
				!editingInfo && !sharingInfo && <TempUI />
			)}

			<div className="mt-2 space-y-2">
				{fakeAnnouncements.reverse() &&
					fakeAnnouncements.map((fakeAnnouncement, i) => (
						<TempAnnouncement
							key={i}
							announcement={fakeAnnouncement}
						></TempAnnouncement>
					))}
				{showSharing && (
					//Lukas clean this up!
					<div className="flex h-32 content-center rounded-xl bg-gray-200 p-4">
						<div className="grid grid-cols-2">
							<LoadingSmall></LoadingSmall>Sharing...
						</div>
					</div>
				)}
			</div>
		</div>
	);

	function isEditorEmpty(editor: EditorState | undefined) {
		if (editor) return editor.toJSON().root.direction === null;
		return true;
	}

	function TempUI() {
		return (
			<div
				className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-solid hover:bg-gray-50 dark:hover:bg-zinc-950"
				onClick={() => setShowPosting(true)}
			>
				<h3 className="mb-4 font-semibold">New Announcement</h3>

				<div className="h-10 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
					Enter a title...
				</div>
				<div className="mt-4 h-10 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
					Description...
				</div>
			</div>
		);
	}
};
//manually adding a change please work
