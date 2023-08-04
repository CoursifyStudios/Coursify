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

	const newLink = () => {
		setSubmission((submission) => ({
			...submission,
			links: [...submission.links, link],
		}));
	};

	const pasteLink = async () => {
		const link = await navigator.clipboard.readText();

		setSubmission((submission) => ({
			...submission,
			links: [...submission.links, link],
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

	// const isValid: boolean = useMemo(() => {
	// 	settings.
	// })
	if (!submission) return null;

	return (
		<>
			{submission.links?.map((link) => (
				<div
					className="rounded-lg border border-gray-300 p-3 flex items-center"
					key={link}
				>
					<LinkIcon className="min-w-[1.5rem] w-5 h-5" />
					<p className="truncate text-sm ml-2">{link}</p>
				</div>
			))}
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
					onClick={newLink}
				>
					<PlusIcon className="h-5 w-5 text-white" />
				</Button>
			</div>
			<div className="flex items-center justify-between">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={false}
					onClick={() => {}}
				>
					Submit
				</Button>

				<Button
					className="text-white"
					color="bg-gray-300"
					disabled={false}
					onClick={pasteLink}
				>
					Paste Link
				</Button>
			</div>
		</>
	);
};

export default Link;
