import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { EditorState } from "lexical";
import { useEffect, useState } from "react";
import { createNewAnnouncement } from "../../lib/db/announcements";
import { Database, Json } from "../../lib/db/database.types";
import { getDataOutArray } from "../../lib/misc/dataOutArray";
import { howLongAgo } from "../../lib/misc/formatDate";
import Editor from "../editors/richeditor";
import { Button } from "../misc/button";
import Loading from "../misc/loading";

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
	return (
		<div className="rounded-xl bg-gray-200 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{announcement.title}</h2>
				<EllipsisVerticalIcon className="h-6 w-6" />
			</div>
			<div className="flex items-center pt-1 pb-2">
				<div className="inline-flex shrink-0 items-center rounded-full bg-gray-300 px-1 py-0.5">
					<img
						src={getDataOutArray(announcement.users!).avatar_url}
						alt=""
						className="h-5 w-5 rounded-full"
					/>
					<p className="ml-1.5 font-semibold text-neutral-700">
						{getDataOutArray(announcement.users!).full_name}
					</p>
				</div>
				<p className="pl-2.5 text-gray-600">{howLongAgo(announcement.time!)}</p>
			</div>
			<Editor
				editable={false}
				initialState={announcement.content}
				className="mt-2"
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
	isClass,
	prevRefreshState,
	refreshAnnouncements,
}: {
	communityid: string;
	isClass: boolean;
	prevRefreshState: boolean;
	refreshAnnouncements: (value: boolean) => void;
}) => {
	const supabase = useSupabaseClient<Database>();
	const [showPost, setShowPost] = useState(false);
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState<EditorState>();
	const [showLoading, setShowLoading] = useState(false);
	const user = useUser();

	const FormObserver: React.FC = () => {
		const { values } = useFormikContext();

		useEffect(() => {
			setTitle((values as { title: string }).title);
		}, [values]);

		return null;
	};

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
								className="h-10 w-96 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium placeholder:text-gray-700"
								autoFocus
							></Field>
						</label>
						<ErrorMessage name="title"></ErrorMessage>

						<FormObserver />
					</Form>
				</Formik>
				<Editor
					editable={true}
					className="my-4 rounded bg-gray-200 p-2"
					updateState={setEditorState}
				/>
				<div className="ml-auto flex space-x-4">
					<Button className="brightness-hover transition hover:bg-red-300">
						<span
							tabIndex={0}
							onClick={() => {
								setShowPost(false);
							}}
						>
							Cancel
						</span>
					</Button>
					<Button
						className={
							isEditorEmpty(editorState) || title.length == 0
								? "text-white"
								: "brightness-hover !bg-blue-500 text-white"
						}
					>
						{isEditorEmpty(editorState) || title.length == 0 ? (
							<span>Post</span>
						) : (
							<span
								tabIndex={0}
								onClick={async () => {
									setShowLoading(true);
									const testing = await createNewAnnouncement(
										supabase,
										user?.id!,
										title,
										editorState?.toJSON() as unknown as Json,
										communityid,
										isClass //possibly a temporary measure
									);
									if (testing) setShowLoading(false);
									refreshAnnouncements(!prevRefreshState);
								}}
							>
								Post
							</span>
						)}
					</Button>
				</div>
			</div>
		);
	} else {
		return <Loading className="flex" />;
	}
};

function isEditorEmpty(editor: EditorState | undefined) {
	if (editor) return editor.toJSON().root.direction === null;
	return true;
}
