import { Button } from "@/components/misc/button";
import Loading, { LoadingSmall } from "@/components/misc/loading";
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
	useRef,
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
	const [disableSubmit, setDisableSubmit] = useState(false);

	const finished = useMemo(() => {
		return true;
	}, []);

	const dbSubmission = useMemo(() => {
		if (revisions.length > 0) {
			return revisions[0];
		}
		return undefined;
	}, [revisions]);

	let currentSubmission = useRef<SubmissionFileUpload>({
		assignmentType: AssignmentTypes.FILE_UPLOAD,
		files:
			dbSubmission && dbSubmission.content
				? (dbSubmission.content as SubmissionFileUpload).files
				: [],
	});

	// TODO: file upload should upload the file the second the user submits it rather then when clicking submit

	useLayoutEffect(() => {
		if (dbSubmission) {
			setSubmission(dbSubmission.content as SubmissionFileUpload);
		} else {
			setSubmission({
				assignmentType: AssignmentTypes.FILE_UPLOAD,
				files: [],
			});
		}
	}, [dbSubmission, setSubmission]);

	const uploadFile = async (file: File) => {
		setError("");

		if (file.size > settings.maxSize * 1048576) {
			setError(
				`One of your files is too big. Max size in bytes: ${
					settings.maxSize * 1048576
				}`
			);
			return;
		}
		if (settings.fileTypes ? settings.fileTypes.includes(file.type) : true) {
			setError(
				`You can only submit files of the types ${settings.fileTypes?.join(
					", "
				)}`
			);
			return;
		}
		if (submission.files.some((f) => f.realName == file.name)) {
			setError("You can't submit multiple files with the same name");
			return;
		}

		const UUID = window.crypto.randomUUID();
		const name = `${UUID}--${user.id}`;
		const path = `submissions/${name}`;

		setDisableSubmit(true);
		setSubmission((submission) => ({
			assignmentType: AssignmentTypes.FILE_UPLOAD,
			files: [
				...submission.files,
				{
					link: `https://cdn.coursify.one/storage/v1/object/public/ugc/${path}`,
					realName: file.name,
					fileName: name,
					size: file.size,
					uploading: true,
				},
			],
		}));

		const { error } = await supabase.storage.from("ugc").upload(path, file);

		if (error) {
			setError(error.message);
			return;
		}

		/**
		 * This is a bit jank, bassiclly if the user initiates multiple file uploads
		 * at the same time and a subsequest one finishes before this one, it'll
		 * be overwritten on the database. If there was a way to fetch the latest version of
		 * state, I wouldn't have to do this, but oh well. We're saving drafts since I don't want
		 * random files not tied to a user since someone forgot to click save draft - Lukas
		 */

		currentSubmission.current = {
			assignmentType: AssignmentTypes.FILE_UPLOAD,
			files: [
				...currentSubmission.current.files,
				{
					link: `https://cdn.coursify.one/storage/v1/object/public/ugc/${path}`,
					realName: file.name,
					fileName: name,
					size: file.size,
				},
			],
		};

		await assignmentSubmission(
			assignmentID,
			currentSubmission.current,
			supabase,
			user,
			false
		);

		setSubmission((submission) => ({
			assignmentType: AssignmentTypes.FILE_UPLOAD,
			files: submission.files.map((f) => {
				if (f.fileName != name) return f;
				const { uploading: _, ...newFile } = f;
				return newFile;
			}),
		}));
		setDisableSubmit(false);

		setRevisions((revisions) => [
			{
				content: currentSubmission.current,
				created_at: new Date().toUTCString(),
				final: false,
			},
			...revisions,
		]);
	};

	const deleteFile = async (fileName: string) => {
		setError("");
		setDisableSubmit(true);

		setSubmission((submission) => ({
			assignmentType: AssignmentTypes.FILE_UPLOAD,
			files: submission.files.map((f) => {
				if (f.fileName != fileName) return f;

				return { ...f, uploading: true };
			}),
		}));

		const { error } = await supabase.storage
			.from("ugc")
			.remove([`submissions/${fileName}`]);

		if (error) {
			setError("Failed to delete file!");
			return;
		}

		// Another bonus of currentSubmission is I can use it to update stuff in the background without affecting the UI

		currentSubmission.current = {
			...currentSubmission.current,
			files: [
				...currentSubmission.current.files.filter(
					(file) => file.fileName != fileName
				),
			],
		};

		await assignmentSubmission(
			assignmentID,
			currentSubmission.current,
			supabase,
			user,
			false
		);

		setSubmission((submission) => ({
			assignmentType: AssignmentTypes.FILE_UPLOAD,
			files: submission.files.filter((file) => file.fileName != fileName),
		}));

		setRevisions((revisions) => [
			{
				content: currentSubmission.current,
				created_at: new Date().toUTCString(),
				final: false,
			},
			...revisions,
		]);
		setDisableSubmit(false);
	};

	const submit = async () => {
		setLoading(true);

		const now = new Date().toUTCString();

		setSubmission(submission);

		const submissionError = await assignmentSubmission(
			assignmentID,
			submission,
			supabase,
			user,
			true
		);
		if (submissionError) {
			setError(submissionError.message);
			return;
		}
		setRevisions((revisions) => [
			{
				content: submission,
				created_at: now,
				final: true,
			},
			...revisions,
		]);
		setLoading(false);
	};

	if (!submission) return null;

	return (
		<>
			{(settings.minFiles > submission.files.length || settings.maxFiles) && (
				<ColoredPill className="mx-auto text-sm " color="gray">
					{settings.minFiles > submission.files.length
						? `${submission.files.length}/${settings.minFiles} minimum files`
						: settings.maxFiles &&
						  `${submission.files.length}/${settings.maxFiles} maximum files`}
				</ColoredPill>
			)}
			{submission.files.length > 0 && (
				<div className="grid lg:grid-cols-2 xl:grid-cols-1 gap-2">
					{submission.files.map((file, i) => (
						<div
							className="rounded-lg border border-gray-300 p-3 flex items-center"
							key={i}
						>
							<DocumentIcon className="min-w-[1.5rem] w-6 h-6" />
							<div className="truncate mx-2 ">
								<p className="truncate max-w-xs text-sm font-medium">
									{file.realName}
								</p>
								<p className="text-xs">{formatBytes(file.size)}</p>
							</div>
							{file.uploading ? (
								<div className="ml-auto">
									<LoadingSmall />
								</div>
							) : (
								<div
									className="rounded hover:bg-gray-300 p-0.5 ml-auto cursor-pointer"
									onClick={() => deleteFile(file.fileName)}
								>
									<XMarkIcon className="h-4 w-4 text-red-500" />
								</div>
							)}
						</div>
					))}
				</div>
			)}
			{settings.maxFiles
				? submission.files.length != settings.maxFiles
				: true && (
						<label
							className="rounded-lg bg-gray-300 p-3 flex items-center brightness-hover cursor-pointer"
							onChange={(e) => {
								// @ts-expect-error idk what react is on but files will be defined
								uploadFile([...e.target.files][0]);
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

			<div className="flex items-center gap-4 justify-between">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={
						disableSubmit ||
						(
							revisions.find((submission) => submission.final == true)
								?.content as SubmissionFileUpload
						).files
							.map((f) => f.fileName)
							.join(",") == submission.files.map((f) => f.fileName).join(",") ||
						loading
					}
					onClick={submit}
				>
					{revisions.some((submission) => submission.final == true)
						? "Resubmit"
						: "Submit"}
				</Button>
				{loading && <Loading className="bg-gray-300" />}
			</div>

			{error && `Error occured while saving: ${error}`}
		</>
	);
};

export default FileUpload;
