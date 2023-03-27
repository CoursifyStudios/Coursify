import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { EditorState } from "lexical";
import { useEffect, useState } from "react";
import { createNewAnnouncement } from "../../lib/db/announcements";
import { Database, Json } from "../../lib/db/database.types";
import Editor from "../editors/richeditor";
import { Button } from "../misc/button";

export const AnnouncementPostingUI = ({
	communityid,
}: {
	communityid: string;
}) => {
	const supabase = useSupabaseClient<Database>();
	const [showPost, setShowPost] = useState(false);
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState<EditorState>();
	const user = useUser();

	const FormObserver: React.FC = () => {
		const { values } = useFormikContext();

		useEffect(() => {
			setTitle((values as { title: string }).title);
		}, [values]);

		return null;
	};

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
					<label htmlFor="title" className="flex flex-col text-sm font-medium">
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
				<Button className="brightness-hover !bg-blue-500 text-white">
					<span
						tabIndex={0}
						onClick={async () => {
							createNewAnnouncement(
								supabase,
								user?.id!,
								title,
								editorState?.toJSON() as unknown as Json
							);
							//@ts-ignore WHY WHY WHY
							// const test = await supabase.rpc("create_announcement", {
							//     title: title,
							//     content: editorState?.toJSON() as unknown as Json,
							//     group_id: communityid
							// });
							// console.log(test);
						}}
					>
						Post
					</span>
				</Button>
			</div>
		</div>
	);
};
