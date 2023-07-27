import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { assignmentSubmission } from "@/lib/db/assignments/submission";
import { Database } from "@/lib/db/database.types";
import {
	CheckCircleIcon,
	MinusCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextPage } from "next";
import {
	Dispatch,
	SetStateAction,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { AssignmentText } from "../../assignmentCreation/three/settings.types";
import { Submission, SubmissionText } from "../submission.types";
import Editor from "@/components/editors/richeditor";
import { EditorState } from "lexical";

const Text: NextPage<{
	imports: {
		revisions: Submission[];
		setRevisions: Dispatch<SetStateAction<Submission[]>>;
		assignmentID: string;
		settings: AssignmentText;
		submission: SubmissionText;
		setSubmission: Dispatch<SetStateAction<SubmissionText>>;
		supabase: SupabaseClient<Database>;
		user: User;
	};
}> = ({
	imports: {
		setRevisions,
		settings,
		setSubmission,
		submission,
		assignmentID,
		supabase,
		revisions,
		user,
	},
}) => {
	const [editorOpen, setEditorOpen] = useState(false);
	const [rawSubmission, setRawSubmission] = useState("");
	const [pasted, setPasted] = useState(false);
	// Returns content and if it can be submitted, as well as the length of the text
	const content = useMemo(() => {
		if (!submission) return { content: "", finished: false, length: 0 };
		const text =
			typeof submission.content == "string"
				? submission.content
				: rawSubmission;
		// : editor
		// 		.parseEditorState(submission.content)
		//	.read(() => $getRoot().getTextContent());
		const textLength = text.length;
		const textWords = (text.match(/\S+/g) || []).length;

		if (!settings.minChars && !settings.maxChars) {
			return {
				content: text,
				finished: textLength > 0,
				length: textLength,
			};
		}
		// char/word count stuff
		if (settings.trueWhenChars) {
			const respectsMin = settings.minChars
				? textLength >= settings.minChars
				: true;
			const respectsMax = settings.maxChars
				? textLength <= settings.maxChars
				: true;
			return {
				content: text,
				finished: respectsMin && respectsMax,
				length: textLength,
			};
		} else {
			const respectsMin = settings.minChars
				? textWords >= settings.minChars
				: true;
			const respectsMax = settings.maxChars
				? textWords <= settings.maxChars
				: true;
			return {
				content: text,
				finished: respectsMin && respectsMax,
				length: textWords,
			};
		}
	}, [rawSubmission, settings, submission]);

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const dbSubmission = useMemo(() => {
		if (revisions.length > 0) {
			return revisions[0];
		}
		return undefined;
	}, [revisions]);

	const stage = useMemo(() => {
		if (revisions.length == 0) return 0;
		if (!revisions[0].final) return 1;

		return 2;
	}, [revisions]);

	useLayoutEffect(() => {
		if (dbSubmission) {
			setSubmission(dbSubmission.content as SubmissionText);
		}
	}, [dbSubmission, setSubmission]);

	const handlePaste = async () => {
		setPasted(true);
		const text = await navigator.clipboard.readText();
		setSubmission({
			assignmentType: AssignmentTypes.TEXT,
			content: text,
		});
		submit(undefined, {
			assignmentType: AssignmentTypes.TEXT,
			content: text,
		});
	};

	const submit = async (draft?: boolean, diffSubmission?: SubmissionText) => {
		setLoading(true);
		const now = new Date().toUTCString();
		const error = await assignmentSubmission(
			assignmentID,
			diffSubmission || submission,
			supabase,
			user,
			draft ? false : content.finished
		);
		if (error) {
			setError(error.message);
			return;
		}
		setRevisions((revisions) => [
			{
				content: submission,
				created_at: now,
				final: draft ? false : content.finished,
			},
			...revisions,
		]);
		setLoading(false);
	};

	return (
		<>
			<div className="flex items-center font-medium">
				{stage == 0 ? (
					<>
						<XCircleIcon className="mr-2 h-5 w-5 text-red-500" /> Nothing
						submitted yet
					</>
				) : stage == 1 ? (
					<>
						<MinusCircleIcon className="mr-2 h-5 w-5 text-neutral-500" /> Draft
						Saved
					</>
				) : (
					<>
						<CheckCircleIcon
							className="mr-2 h-5 w-5 text-blue-600"
							strokeWidth={2}
						/>
						Assignment Submitted
					</>
				)}
			</div>
			<div className="flex items-center justify-between">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={false}
					onClick={() => setEditorOpen(true)}
				>
					Open Editor
				</Button>
				<Button
					className="text-white"
					color="bg-gray-300"
					disabled={false}
					onClick={handlePaste}
				>
					Paste Text
				</Button>
			</div>
			{error && `Error occured while saving: ${error}`}
			<Popup open={editorOpen} closeMenu={() => setEditorOpen(false)}>
				<h2 className="title-sm">Submission Editor</h2>
				{settings.rich &&
				(submission ? typeof submission.content != "string" : true) &&
				!pasted ? (
					<Editor
						editable={true}
						backdrop={false}
						focus={true}
						updateState={(state: EditorState) =>
							setSubmission({
								assignmentType: AssignmentTypes.TEXT,
								content: state.toJSON(),
							})
						}
						updateRaw={setRawSubmission}
						className=" border-gray-300 mt-4 mb-2 rounded-xl p-4 shadow-lg dark:border"
						initialState={
							(revisions &&
								revisions.length > 0 &&
								typeof revisions[0].content != "string" &&
								//@ts-expect-error
								revisions[0].content.content) ||
							undefined
						}
					/>
				) : (
					<textarea
						className="mt-4 max-h-[80vh] min-h-[15rem]"
						placeholder={"Start writing..."}
						onChange={(e) =>
							setSubmission({
								assignmentType: AssignmentTypes.TEXT,
								content: e.target.value,
							})
						}
						defaultValue={
							dbSubmission &&
							typeof (dbSubmission?.content as SubmissionText).content ==
								"string"
								? //@ts-expect-error huh.mp4
								  dbSubmission.content.content
								: ""
						}
					/>
				)}
				<div className="ml-auto flex text-sm text-gray-700">
					{settings.minChars && content.length < settings.minChars && (
						<p>
							<span className="text-red-700">{content.length}</span> /{" "}
							{settings.minChars} min{" "}
							{settings.trueWhenChars ? "chars" : "words"}
						</p>
					)}{" "}
					{settings.maxChars &&
						(!settings.minChars || content.length >= settings.minChars) && (
							<p>
								<span
									className={
										(content.length > settings.maxChars && "text-red-700") || ""
									}
								>
									{content.length}
								</span>{" "}
								/ {settings.maxChars} max{" "}
								{settings.trueWhenChars ? "chars" : "words"}
							</p>
						)}
				</div>
				<div className="mt-4 flex items-center">
					{loading && <Loading />}
					<div className="flex items-center ml-auto">
						{/* {settings.rich && submission && typeof submission.content == "string" && 
					<p className="text-blue-500 hover:underline cursor-pointer" onClick={() => setSubmission(undefined)}>Reset to rich editor</p>
					} */}
						<Button
							className="text-white"
							color="bg-gray-200 mx-4 "
							disabled={content.length === 0}
							onClick={() => submit(true)}
						>
							Save Draft
						</Button>
						<Button
							className="text-white"
							color="bg-blue-500"
							disabled={!content.finished}
							onClick={() => submit()}
						>
							Submit
						</Button>
					</div>
				</div>
			</Popup>
		</>
	);
};

export default Text;
