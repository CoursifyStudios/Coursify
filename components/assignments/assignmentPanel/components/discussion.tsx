import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { assignmentSubmission } from "@/lib/db/assignments/submission";
import { Database } from "@/lib/db/database.types";
import {
	CheckCircleIcon,
	EllipsisVerticalIcon,
	MinusCircleIcon,
	PencilIcon,
	TrashIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextPage } from "next";
import {
	Dispatch,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import {
	AssignmentDiscussionPost,
	DiscussionPermissions,
} from "../../assignmentCreation/three/settings.types";
import { Submission, SubmissionText } from "../submission.types";
import Editor from "@/components/editors/richeditor";
import { EditorState } from "lexical";
import { formatDate } from "@/lib/misc/dates";
import MenuSelect from "@/components/misc/menu";
import Image from "next/image";
import Link from "next/link";
import { useTabs } from "@/lib/tabs/handleTabs";

const Discussion: NextPage<{
	imports: {
		revisions: Submission[];
		setRevisions: Dispatch<SetStateAction<Submission[]>>;
		assignmentID: string;
		settings: AssignmentDiscussionPost;
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
	const [clearEditor, setClearEditor] = useState(false);
	const [rawSubmission, setRawSubmission] = useState("");
	// Used text accidentally, too late to fix it :/ -LS
	const [classSubmissions, setClassSubmissions] = useState<Submission[]>();
	const { newTab } = useTabs();
	const viewOtherSubmissions = useMemo(() => {
		if (settings.permissions == DiscussionPermissions.ALWAYS) return true;

		const posted = revisions.some((rev) => rev.final);
	}, [revisions]);
	const [loadingMsg, setLoadingMsg] = useState("");

	useEffect(() => {
		(async () => {
			if (supabase && user && !classSubmissions) {
				setError("");
				const { data: submissions, error } = await supabase
					.from("submissions")
					.select(
						"content, final, created_at, users ( id, full_name, avatar_url )"
					)
					.eq("assignment_id", assignmentID)
					.neq("user_id", user.id);
				if (submissions) {
					setClassSubmissions(submissions as Submission[]);
				}
				if (error) {
					setError(
						"Failed to fetch your peers submissions. Error: " + error.message
					);
				}
			}
		})();
	}, [assignmentID, classSubmissions, supabase, user, user.id]);

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
		const text = await navigator.clipboard.readText();
		setSubmission({
			assignmentType: AssignmentTypes.TEXT,
			content: text,
		});
		setTimeout(submit, 20);
	};

	const submit = async (draft?: boolean) => {
		setLoading(true);
		const now = new Date().toUTCString();
		const error = await assignmentSubmission(
			assignmentID,
			submission,
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
				// add user
			},
			...revisions,
		]);
		setLoading(false);
	};

	const deletePost = async (date: string) => {
		setLoadingMsg("Deleting post...");
		const { error, count } = await supabase
			.from("submissions")
			.delete({ count: "exact" })
			.eq("user_id", user.id)
			.eq("created_at", date);
		if (error || count == 0) {
			setLoadingMsg(
				`Failed to delete post. Try reloading first. ${
					error ? `Error: ${error.message}` : ""
				}`
			);
			return;
		}
		setLoadingMsg("Deleted post!");
		setRevisions((revs) => revs.filter((rev) => rev.created_at != date));
	};

	return (
		<>
			<Editor
				editable={true}
				backdrop={false}
				toolbarClassName="bg-backdrop"
				focus={true}
				updateState={(state: EditorState) =>
					setSubmission({
						assignmentType: AssignmentTypes.TEXT,
						content: state.toJSON(),
					})
				}
				clearEditor={clearEditor}
				updateRaw={setRawSubmission}
				className=" border-gray-300 mt-4 mb-2 rounded-xl p-4 shadow-lg dark:border"
				initialState={
					(revisions &&
						revisions.length > 0 &&
						typeof revisions[0].content != "string" &&
						revisions[0].final == false &&
						//@ts-expect-error
						revisions[0].content.content) ||
					undefined
				}
			/>

			<div className="ml-auto flex text-sm text-gray-700">
				{settings.minChars && content.length < settings.minChars && (
					<p>
						<span className="text-red-700">{content.length}</span> /{" "}
						{settings.minChars} min {settings.trueWhenChars ? "chars" : "words"}
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
						className="dark:text-white"
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
						onClick={() => {
							submit();
							setClearEditor(true);
							setClearEditor(true);
						}}
					>
						Post
					</Button>
				</div>
			</div>
			{loadingMsg && `Message from server: ${loadingMsg}`}
			{error && `Error occured while saving: ${error}`}
			<div className="flex flex-col gap-4 mt-8">
				{revisions
					.filter((revision) => revision.final == true)
					.map((v) => (
						<div
							className="bg-gray-200 px-4 py-5 rounded-xl"
							key={v.created_at}
						>
							<div className="flex items-center">
								<Image
									width={32}
									height={32}
									className="rounded-full h-8 w-8 select-none"
									src={v.users?.avatar_url || user.user_metadata.avatar_url}
									alt="user avatar"
									draggable={false}
								/>
								<div className="ml-3">
									<Link
										href={`/profile/${
											v.users?.id || user.user_metadata.full_name
										}`}
										onClick={() => newTab(`/profile/${v.users?.id || user.id}`)}
									>
										<h3 className="font-medium">
											{v.users?.full_name || user.user_metadata.full_name}
										</h3>
									</Link>
									<p className="text-xs text-gray-700">
										{formatDate(new Date())}
									</p>
								</div>
								<div className="ml-auto">
									<MenuSelect
										items={[
											// {
											// 	content: (
											// 		<>
											// 			{" "}
											// 			Edit <PencilIcon className="h-5 w-5" />{" "}
											// 		</>
											// 	),
											// 	className: "",
											// 	onClick: () => {},
											// },
											{
												content: (
													<>
														{" "}
														Delete <TrashIcon className="h-5 w-5" />{" "}
													</>
												),
												onClick: () => deletePost(v.created_at),
											},
										]}
									>
										<div className=" p-2 hover:bg-gray-200">
											<EllipsisVerticalIcon className="h-6 w-6" />
										</div>
									</MenuSelect>
								</div>
							</div>
							<Editor
								editable={false}
								className=" "
								//@ts-expect-error I promise it does exist ts
								initialState={v.content.content}
							/>
						</div>
					))}
				{classSubmissions &&
					classSubmissions.map((submission) => (
						<div
							className="bg-gray-200 px-4 py-5 rounded-xl"
							key={submission.created_at}
						>
							<div className="flex items-center">
								<Image
									width={32}
									height={32}
									className="rounded-full h-8 w-8 select-none"
									src={submission.users?.avatar_url || ""}
									alt="user avatar"
									draggable={false}
								/>
								<div className="ml-3">
									<Link
										href={`/profile/${submission.users?.id}`}
										onClick={() => newTab(`/profile/${submission.users?.id}`)}
									>
										<h3 className="font-medium">
											{submission.users?.full_name}
										</h3>
									</Link>
									<p className="text-xs text-gray-700">
										{formatDate(new Date())}
									</p>
								</div>
							</div>
							<Editor
								editable={false}
								className=" "
								//@ts-expect-error I promise it does exist ts
								initialState={submission.content.content}
							/>
						</div>
					))}
			</div>
		</>
	);
};

export default Discussion;
