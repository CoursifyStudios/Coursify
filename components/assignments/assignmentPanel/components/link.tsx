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
import { AssignmentLink } from "../../assignmentCreation/three/settings.types";
import { Submission, SubmissionLink } from "../submission.types";
import * as Yup from "yup";
import { ErrorMessage, Formik } from "formik";

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
	const [editorOpen, setEditorOpen] = useState(false);

	return (
		<>
			<div className="flex items-center justify-between">
				<Button
					className="text-white"
					color="bg-blue-500"
					disabled={false}
					onClick={() => setEditorOpen(true)}
				>
					Submit
				</Button>

				<Button
					className="text-white"
					color="bg-gray-300"
					disabled={false}
					onClick={() => {}}
				>
					Paste Link
				</Button>
			</div>
		</>
	);
};

export default Link;
