import { Button } from "@/components/misc/button";
import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { assignmentSubmission } from "@/lib/db/assignments/submission";
import { Database } from "@/lib/db/database.types";
import { IdentificationIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextPage } from "next";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AssignmentCheckoff } from "../../assignmentCreation/three/settings.types";
import { Submission, SubmissionCheckoff } from "../submission.types";

const CheckBox: NextPage<{
	imports: {
		setRevisions: Dispatch<SetStateAction<Submission[]>>;
		assignmentID: string;
		settings: AssignmentCheckoff;
		submission: SubmissionCheckoff;
		setSubmission: Dispatch<SetStateAction<SubmissionCheckoff>>;
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
		user,
	},
}) => {
	const finished = useMemo(() => {
		return Boolean(
			submission &&
				submission.checkboxes &&
				settings.checkboxes.length == submission.checkboxes.length
		);
	}, [settings.checkboxes.length, submission]);

	const [error, setError] = useState("");

	const submit = async () => {
		const now = new Date().toUTCString();
		const error = await assignmentSubmission(
			assignmentID,
			submission,
			supabase,
			user,
			finished
		);
		if (error) {
			setError(error.message);
			return;
		}
		setRevisions((revisions) => [
			...revisions,
			{ content: submission, created_at: now, final: finished },
		]);
	};

	return (
		<>
			{settings.checkboxes.map((checkbox) => {
				const checked =
					submission &&
					submission.checkboxes &&
					submission.checkboxes.includes(checkbox.step);
				return (
					<button
						// NOTE: `step` is based on the order the checkboxes were created,
						// and acts as a unique id. However, it isn't nessesarily in the
						// chronological order of what a student needs to complete.
						key={checkbox.step}
						className={`flex items-center disabled:cursor-not-allowed disabled:text-gray-600 dark:disabled:text-gray-400 [&>div:first-child]:disabled:opacity-50`}
						disabled={checkbox.teacher}
						onClick={() =>
							setSubmission((sub) => {
								if (!checked) {
									return {
										assignmentType: AssignmentTypes.CHECKOFF,
										checkboxes:
											sub && sub.checkboxes
												? [...sub.checkboxes, checkbox.step]
												: [checkbox.step],
									};
								} else {
									return {
										assignmentType: AssignmentTypes.CHECKOFF,
										checkboxes: sub.checkboxes!.filter(
											(box) => box != checkbox.step
										),
									};
								}
							})
						}
					>
						<div
							className={`checkbox mr-3 h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition  ${
								checked ? "bg-gray-300 " : "dark:bg-neutral-950"
							}`}
						>
							{checked && <CheckIcon />}
						</div>
						<div className="text-left">
							<h3 className="flex items-center text-sm font-medium">
								{checkbox.name}
								{checkbox.teacher && (
									<Info
										icon={
											<IdentificationIcon className="ml-2 h-5 w-5 text-gray-800" />
										}
										size="small"
									>
										<p className="text-gray-800">Teacher Only</p>
									</Info>
								)}
							</h3>
							<p className="text-xs">{checkbox.description}</p>
						</div>
					</button>
				);
			})}
			<Button
				className="text-white"
				color="bg-blue-500"
				disabled={
					!(
						submission &&
						submission.checkboxes &&
						submission.checkboxes.length != 0
					)
				}
				onClick={submit}
			>
				{finished ? "Submit" : "Save"}
			</Button>
		</>
	);
};

export default CheckBox;
