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
	XMarkIcon,
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
import { formatBytes } from "@/lib/misc/convertBytes";
import { ColoredPill } from "@/components/misc/pill";

const FileUpload: NextPage<{
	imports: {
		revisions: Submission[];
		setRevisions: Dispatch<SetStateAction<Submission[]>>;
		assignmentID: string;
		settings: AssignmentFileUpload;
		submission: SubmissionFileUpload;
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

	const dbSubmission = useMemo(() => {
		if (revisions.length > 0) {
			return revisions[0];
		}
		return undefined;
	}, [revisions]);

	// TODO: file upload should upload the file the second the user submits it rather then when clicking submit

	useLayoutEffect(() => {
		if (dbSubmission) {
			setSubmission(dbSubmission.content as SubmissionFileUpload);
		}
	}, [dbSubmission, setSubmission]);

	const submit = async (final: boolean) => {
		setError("");
		if (files.some((file) => file.size > settings.maxSize * 1048576)) {
			setError(
				`One of your files is too big. Max size in bytes: ${
					settings.maxSize * 1048576
				}`
			);
			return;
		}
		if (
			files.some((file) =>
				settings.fileTypes ? settings.fileTypes.includes(file.type) : false
			)
		) {
			setError(
				`You can only submit files of the types ${settings.fileTypes?.join(
					", "
				)}`
			);
			return;
		}
		setLoading(true);
		const UUID = window.crypto.randomUUID();

		const { data, error } = await supabase.storage
			.from("ugc")
			.upload(UUID, files[0]);

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		const link = `https://cdn.coursify.one/storage/v1/object/public/ugc/${data?.path}`;

		const now = new Date().toUTCString();

		const submission: SubmissionFileUpload = {
			assignmentType: AssignmentTypes.FILE_UPLOAD,
			files: files.map((file) => ({
				name: file.name,
				link,
				uuid: UUID,
				size: file.size,
			})),
		};

		setSubmission(submission);

		const submissionError = await assignmentSubmission(
			assignmentID,
			submission,
			supabase,
			user,
			final
		);
		if (submissionError) {
			setError(submissionError.message);
			return;
		}
		setRevisions((revisions) => [
			{
				content: submission,
				created_at: now,
				final,
			},
			...revisions,
		]);
		setLoading(false);
	};

	return (
		<>
			{(settings.minFiles > files.length || settings.maxFiles) && (
				<ColoredPill className="mx-auto text-sm " color="gray">
					{settings.minFiles > files.length
						? `${files.length}/${settings.minFiles} minimum files`
						: settings.maxFiles &&
						  `${files.length}/${settings.maxFiles} maximum files`}
				</ColoredPill>
			)}
			{files.length > 0 && (
				<div className="grid lg:grid-cols-2 xl:grid-cols-1 gap-2">
					{files.map((file, i) => (
						<div
							className="rounded-lg border border-gray-300 p-3 flex items-center"
							key={i}
						>
							<DocumentIcon className="w-6 h-6" />
							<div className="truncate mx-2 ">
								<p className="truncate max-w-xs text-sm font-medium">
									{file.name}
								</p>
								<p className="text-xs">{formatBytes(file.size)}</p>
							</div>
							<div
								className="rounded hover:bg-gray-300 p-0.5 ml-auto cursor-pointer"
								onClick={() =>
									setFiles((files) =>
										files.filter(
											(mappedFile) =>
												mappedFile.name != file.name &&
												mappedFile.size != file.size
										)
									)
								}
							>
								<XMarkIcon className="h-4 w-4 text-red-500" />
							</div>
						</div>
					))}
				</div>
			)}
			{files.length != 5 && (
				<label
					className="rounded-lg bg-gray-300 p-3 flex items-center brightness-hover cursor-pointer"
					onChange={(e) => {
						// @ts-expect-error idk what react is on but files will be defined
						setFiles((files) => files.concat([...e.target.files]));
					}}
				>
					<DocumentArrowUpIcon className="w-6 h-6" />
					<div className="ml-4">
						<h4 className="font-medium text-sm">Upload File</h4>
						<p className="text-xs">Click to select or drop file</p>
					</div>
					<input type="file" className="hidden" />
				</label>
			)}

			<div className="flex items-center gap-4">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={false}
					onClick={() => submit(true)}
				>
					Submit
				</Button>
				<Button
					color="bg-gray-300"
					disabled={false}
					onClick={() => submit(false)}
				>
					Save Draft
				</Button>
			</div>
			{loading && <Loading className="bg-gray-300" />}
			{error && `Error occured while saving: ${error}`}
		</>
	);
};

export default FileUpload;
