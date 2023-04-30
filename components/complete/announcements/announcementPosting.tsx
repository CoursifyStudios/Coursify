
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useFormikContext, Formik, Form, Field, ErrorMessage } from "formik";
import { EditorState } from "lexical";
import { useState, useEffect } from "react";
import { crossPostAnnouncements } from "../../../lib/db/announcements";
import { getClassesForUserBasic } from "../../../lib/db/classes";
import { Database, Json } from "../../../lib/db/database.types";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import { Button } from "../../misc/button";
import Loading from "../../misc/loading";
import { ColoredPill } from "../../misc/pill";
import { CommunityPicker } from "./communityPicker";
import Editor from "../../editors/richeditor";

export const AnnouncementPostingUI = ({
	communityid,
	prevRefreshState,
	refreshAnnouncements,
	editing,
}: {
	communityid: string;
	prevRefreshState: boolean;
	refreshAnnouncements: (value: boolean) => void;
	editing?: boolean;
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

					<div className="h-10 rounded border-none bg-gray-200 py-1.5 pl-3 text-lg font-medium text-gray-700">
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
					focus={false}
				/>

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
								if (
									user &&
									!isEditorEmpty(editorState) &&
									!(title.length == 0)
								) {
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

	function isEditorEmpty(editor: EditorState | undefined) {
		if (editor) return editor.toJSON().root.direction === null;
		return true;
	}
};
