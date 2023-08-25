import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { assignmentSubmission } from "@/lib/db/assignments/submission";
import { Database } from "@/lib/db/database.types";
import {
	CheckCircleIcon,
	LinkIcon,
	MinusCircleIcon,
	PlusIcon,
	XCircleIcon,
	XMarkIcon,
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
import { AssignmentLink } from "../../assignmentCreation/three/settings.types";
import { Submission, SubmissionLink } from "../submission.types";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ColoredPill } from "@/components/misc/pill";

const Link: NextPage<{
	imports: {
		revisions: Submission[];
		setRevisions: Dispatch<SetStateAction<Submission[]>>;
		assignmentID: string;
		settings: AssignmentLink;
		submission: SubmissionLink;
		setSubmission: Dispatch<SetStateAction<SubmissionLink>>;
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
	const [link, setLink] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

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

	const maxedLinks = useMemo(
		() => (submission ? submission.links.length == settings.maxUrls : false),
		[submission, settings.maxUrls]
	);

	const newLink = (paramsLink?: string) => {
		setError("");
		let scopedLink = paramsLink ?? link;

		if (submission.links.includes(scopedLink)) {
			setError("No duplicates");
			return;
		}

		if (!scopedLink.includes(".")) {
			setError("Must be a valid link");
			return;
		}

		if (scopedLink.startsWith("http://") && settings.enforceHttps) {
			scopedLink = scopedLink.slice(7);
		}

		if (
			!scopedLink.startsWith("http://") &&
			!scopedLink.startsWith("https://")
		) {
			scopedLink = "https://" + scopedLink;
		}

		const url = new URL(scopedLink);

		// normalize the link from the user, then compare with urls from settings

		if (
			settings.urls &&
			settings.urls.length > 0 &&
			!settings.urls?.includes(url.hostname)
		) {
			setError(
				`This url is not allowed. Allowed base urls: ${settings.urls.join(
					", "
				)}`
			);
			return;
		}

		if (!submission.links.includes(scopedLink)) {
			setSubmission((submission) => ({
				...submission,
				links: [...submission.links, scopedLink],
			}));
		}
		setLink("");
	};

	const pasteLink = async () => {
		const link = await navigator.clipboard.readText();

		newLink(link);
	};

	const deleteLink = async (link: string) => {
		setError("");
		setSubmission((submission) => ({
			...submission,
			links: submission.links.filter((mappedLink) => mappedLink != link),
		}));
	};

	const dbSubmission = useMemo(() => {
		if (revisions.length > 0) {
			return revisions[0];
		}
		return undefined;
	}, [revisions]);

	useLayoutEffect(() => {
		if (dbSubmission) {
			setSubmission(dbSubmission.content as SubmissionLink);
		} else {
			setSubmission({
				assignmentType: AssignmentTypes.LINK,
				links: [],
			});
		}
	}, [dbSubmission, setSubmission]);

	if (!submission) return null;

	return (
		<>
			<ColoredPill className="mx-auto text-sm " color="gray">
				{submission.links.length}/{settings.maxUrls} maximum links
			</ColoredPill>
			{submission.links?.map((link) => (
				<div
					className="rounded-lg border border-gray-300 p-3 flex items-center"
					key={link}
				>
					<div className="relative">
						<LinkIcon className="min-w-[1.5rem] w-5 h-5" />
						{/* <img
							src={`https://f1.allesedv.com/16/${link}`}
							className="inset-0 absolute h-5 w-5"
						/> */}
					</div>
					<p className="truncate text-sm ml-2 max-w-sm">{link}</p>
					<div
						className="rounded hover:bg-gray-300 p-0.5 ml-auto cursor-pointer"
						onClick={() => deleteLink(link)}
					>
						<XMarkIcon className="h-4 w-4 text-red-500" />
					</div>
				</div>
			))}
			{!maxedLinks && (
				<form onSubmit={(e) => e.preventDefault()}>
					<div className="flex ">
						<input
							type="text"
							name="link"
							className="grow w-1"
							placeholder="example.com"
							value={link}
							onChange={(e) => setLink(e.target.value)}
						/>
						<Button
							className=" ml-2 !px-3 rounded-full"
							color="bg-gray-300"
							disabled={false}
							onClick={() => newLink()}
						>
							<PlusIcon className="h-5 w-5 dark:text-white " />
						</Button>
					</div>
				</form>
			)}
			<div className="flex items-center justify-between">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={
						submission.links.length == 0 ||
						(dbSubmission && dbSubmission.content
							? (dbSubmission.content as SubmissionLink).links
									.sort()
									.join(",") == submission.links.sort().join(",")
							: false)
					}
					onClick={submit}
				>
					Submit
				</Button>
				{!maxedLinks && !loading && (
					<Button
						className="dark:text-white "
						color="bg-gray-300"
						disabled={false}
						onClick={pasteLink}
					>
						Paste Link
					</Button>
				)}
				{loading && <Loading className="bg-gray-300 ml-auto" />}
			</div>
			{error && <p className="text-red-500 text-sm">Error: {error}</p>}
		</>
	);
};

export default Link;
