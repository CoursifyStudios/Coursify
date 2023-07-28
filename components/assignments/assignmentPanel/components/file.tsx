import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { assignmentSubmission } from "@/lib/db/assignments/submission";
import { Database } from "@/lib/db/database.types";
import {
	CheckCircleIcon,
	DocumentArrowUpIcon,
	DocumentIcon,
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
import {
	AssignmentFileUpload,
	AssignmentText,
} from "../../assignmentCreation/three/settings.types";
import {
	Submission,
	SubmissionFileUpload,
	SubmissionText,
} from "../submission.types";
import Editor from "@/components/editors/richeditor";
import { EditorState } from "lexical";

const FileUpload: NextPage<{
	imports: {
		revisions: Submission[];
		setRevisions: Dispatch<SetStateAction<Submission[]>>;
		assignmentID: string;
		settings: AssignmentFileUpload;
		submission: SubmissionText;
		setSubmission: Dispatch<SetStateAction<SubmissionFileUpload>>;
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
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const finished = useMemo(() => {
		return true;
	}, []);
	const [files, setFiles] = useState<File[]>([]);

	const handlePaste = async () => {
		//setPasted(true);
		const text = await navigator.clipboard.readText();
		// setSubmission({
		// 	assignmentType: AssignmentTypes.FILE_UPLOAD,
		// 	//content: text,
		// });
		// submit(undefined, {
		// 	assignmentType: AssignmentTypes.TEXT,
		// 	content: text,
		// });
	};

	const dbSubmission = useMemo(() => {
		if (revisions.length > 0) {
			return revisions[0];
		}
		return undefined;
	}, [revisions]);

	const submit = async (draft: boolean) => {
		setLoading(true);
		const now = new Date().toUTCString();
		const error = await assignmentSubmission(
			assignmentID,
			submission,
			supabase,
			user,
			draft
		);
		if (error) {
			setError(error.message);
			return;
		}
		setRevisions((revisions) => [
			{
				content: submission,
				created_at: now,
				final: draft,
			},
			...revisions,
		]);
		setLoading(false);
	};

	return (
		<>
			<div className="grid lg:grid-cols-2 xl:grid-cols-1">
				{files.map((file, i) => (
					<div
						className="rounded-lg border border-gray-300 p-3 flex items-center"
						key={i}
					>
						<DocumentIcon className="w-6 h-6" />
						<p className="truncate max-w-xs ml-2 text-sm"></p>
					</div>
				))}
			</div>
			<label
				className="rounded-lg bg-gray-300 p-3 flex items-center brightness-hover cursor-pointer"
				// @ts-expect-error idk what react is on but files will be defined
				onChange={(e) => setFiles((files) => files.concat(e.target.files))}
			>
				<DocumentArrowUpIcon className="w-6 h-6" />
				<div className="ml-4">
					<h4 className="font-medium text-sm">Upload File</h4>
					<p className="text-xs">Click to select or drop file</p>
				</div>
				<input type="file" className="hidden" />
			</label>
			<div className="flex items-center justify-between">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={false}
					//onClick={submit}
				>
					{finished
						? dbSubmission?.final
							? "Submitted!"
							: "Submit"
						: dbSubmission?.final
						? "Resubmit Draft"
						: "Save Draft"}
				</Button>
				{loading && <Loading className="bg-gray-300" />}
			</div>
			{error && `Error occured while saving: ${error}`}
		</>
	);
};

export default FileUpload;
