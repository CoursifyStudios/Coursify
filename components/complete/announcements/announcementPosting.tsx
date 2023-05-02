import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useFormikContext, Formik, Form, Field, ErrorMessage } from "formik";
import { EditorState } from "lexical";
import { useState, useEffect } from "react";
import {
	crossPostAnnouncements,
	editAnnouncement,
	shareAnnouncement,
} from "../../../lib/db/announcements";
import { getClassesForUserBasic } from "../../../lib/db/classes";
import { Database, Json } from "../../../lib/db/database.types";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import { Button } from "../../misc/button";
import { ColoredPill } from "../../misc/pill";
import { CommunityPicker } from "./communityPicker";
import Editor from "../../editors/richeditor";
import { TempAnnouncement } from "./tempAnnouncement";
import { Announcement } from ".";
import { howLongAgo } from "../../../lib/misc/dates";

export const AnnouncementPostingUI = ({
	communityid,
	sharingInfo,
	editingInfo,
}: {
	communityid: string;
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
		title: string;
		content: Json;
		time: string;
		setEditing?: (value: boolean) => void;
	};
}) => {
	const supabase = useSupabaseClient<Database>();
	const [showPost, setShowPost] = useState(
		editingInfo || sharingInfo ? true : false
	);
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState<EditorState>();
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
	const [fakeAnnouncements, setFakeAnnouncements] = useState<
		{
			author: string;
			class_id: string;
			content: Json;
			title: string;
		}[]
	>([]);
	const [realAnnouncements, setRealAnnouncements] = useState<
		{
			author: string;
			content: Json;
			id: string;
			time: string | null;
			title: string | null;
		}[]
	>([]);
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

	return (
		<div>
			{showPost ? (
				<div className="flex flex-col rounded-xl border-2  border-gray-300 bg-gray-50 p-4">
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
									className="h-10 rounded border-gray-300 bg-white py-1.5 pl-3 text-lg font-normal placeholder:text-gray-700 focus:ring-1"
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
						initialState={editingInfo && editingInfo.content}
						focus={false}
					/>
					{sharingInfo?.announcement && (
						<TempAnnouncement
							announcement={{
								author: sharingInfo.announcement.author,
								content: sharingInfo.announcement.content,
								title: sharingInfo.announcement.title as string,
								time: howLongAgo(sharingInfo.announcement.time as string),
								users: sharingInfo.announcement.users,
							}}
						></TempAnnouncement>
					)}

					<div className="mb-4 flex flex-wrap gap-4">
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
								className="brightness-hover transition hover:bg-red-300"
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
										: setShowPost(false);
									editingInfo?.setEditing
										? editingInfo.setEditing(false)
										: setShowPost(false);
								}}
							>
								Cancel
							</Button>
							<Button
								className="text-white"
								color="bg-blue-500"
								onClick={async () => {
									if (sharingInfo && user) {
										setShowPost(false);
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
									} else if (editingInfo?.setEditing) {
										if (
											user &&
											((editorState?.toJSON() as unknown as Json) !=
												editingInfo.content ||
												title != editingInfo.title)
										) {
											setFakeAnnouncements(
												fakeAnnouncements.concat({
													author: user.id,
													class_id: communityid,
													content: editorState?.toJSON() as unknown as Json,
													title: title,
												})
											);
											setShowPost(false);
											const newAnnouncement = await editAnnouncement(
												supabase,
												{
													author: user.id,
													title: editingInfo.title,
													time: editingInfo.time,
												},
												{
													title: title,
													content: editorState?.toJSON() as unknown as Json,
												}
											);
										}
									} else {
										if (
											user &&
											!isEditorEmpty(editorState) &&
											!(title.length == 0)
										) {
											setFakeAnnouncements(
												fakeAnnouncements.concat({
													author: user.id,
													class_id: communityid,
													content: editorState?.toJSON() as unknown as Json,
													title: title,
												})
											);

											setShowPost(false);
											const dBReturn = await crossPostAnnouncements(
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
											setRealAnnouncements(
												realAnnouncements.concat(
													dBReturn.data!.find(
														(announcement) =>
															announcement.class_id == communityid
													)!
												)
											);
											!sharingInfo &&
												setChosenCommunities([
													{
														id: communityid,
														name: "",
													},
												]);
										}
									}
								}}
								disabled={isEditorEmpty(editorState) || title.length == 0}
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
				!editingInfo &&
				!sharingInfo && (
					<div
						className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-solid hover:bg-gray-50"
						onClick={() => setShowPost(true)}
					>
						<h3 className="mb-4 font-semibold">New Announcement</h3>

						<div className="h-10 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
							Enter a title...
						</div>
						<div className="mt-4 h-10 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
							Description...
						</div>
					</div>
				)
			)}

			<div className="mt-2 space-y-2">
				{fakeAnnouncements.reverse() &&
					fakeAnnouncements.map((fakeAnnouncement, i) => (
						<TempAnnouncement
							key={i}
							announcement={fakeAnnouncement}
						></TempAnnouncement>
					))}
				{realAnnouncements.sort((a, b) => {
					if (new Date(a.time!).getTime() > new Date(b.time!).getTime())
						return -1;
					if (new Date(a.time!).getTime() < new Date(b.time!).getTime())
						return 1;
					return 0;
				}) &&
					realAnnouncements.map((realAnnouncement) => (
						<Announcement
							key={realAnnouncement.id}
							announcement={{
								author: realAnnouncement.author,
								content: realAnnouncement.content,
								id: realAnnouncement.id,
								parent: null,
								time: realAnnouncement.time,
								title: realAnnouncement.title,
								users: {
									avatar_url: user?.user_metadata.picture,
									full_name: user?.user_metadata.name,
								},
								type: 0,
							}}
							classID={communityid}
						></Announcement>
					))}
			</div>
		</div>
	);

	function isEditorEmpty(editor: EditorState | undefined) {
		if (editor) return editor.toJSON().root.direction === null;
		return true;
	}
};
