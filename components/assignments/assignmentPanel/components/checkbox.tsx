import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { assignmentSubmission } from "@/lib/db/assignments/submission";
import { Database } from "@/lib/db/database.types";
import { IdentificationIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextPage } from "next";
import {
	Dispatch,
	SetStateAction,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { AssignmentCheckoff } from "../../assignmentCreation/three/settings.types";
import { Submission, SubmissionCheckoff } from "../submission.types";

const CheckBox: NextPage<{
	imports: {
		revisions: Submission[];
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
		revisions,
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
	const [loading, setLoading] = useState(false);

	const dbSubmission = useMemo(() => {
		if (revisions.length > 0) {
			return revisions[0];
		}
		return undefined;
	}, [revisions]);

	useLayoutEffect(() => {
		if (dbSubmission) {
			setSubmission(dbSubmission.content as SubmissionCheckoff);
		}
	}, [dbSubmission, setSubmission]);

	const submit = async () => {
		setLoading(true);
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
			{ content: submission, created_at: now, final: finished },
			...revisions,
		]);
		setLoading(false);
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
						<div className="w-full text-left">
							<h3 className="w-full flex items-center text-sm font-medium">
								{checkbox.name}
								{checkbox.teacher && (
									<Info
										icon={
											<IdentificationIcon className="w-full ml-2 h-5 w-5 text-gray-800" />
										}
										size="small"
									>
										<p className="w-full text-gray-800">Teacher Only</p>
									</Info>
								)}
							</h3>
							<p className="w-full text-xs">{checkbox.description}</p>
						</div>
					</button>
				);
			})}
			<div className="w-full flex items-center justify-between">
				<Button
					className="w-full text-white"
					color="bg-blue-500"
					disabled={
						// Disabled if no submission
						!submission ||
						!submission.checkboxes ||
						// Disables if no checkboxes are selected and theres no privious submissions
						(submission.checkboxes.length == 0 && dbSubmission == undefined) ||
						// Disables if assignment is submitted and complete
						(finished && dbSubmission?.final) ||
						// Disables while assignment is submitting
						loading ||
						// Disables if checkboxes on most recent submission match checkboxes on client
						(dbSubmission != undefined &&
							(dbSubmission.content as SubmissionCheckoff).checkboxes !=
								undefined &&
							submission.checkboxes.sort().join(",") ===
								//@ts-expect-error huh.mp4
								(dbSubmission.content as SubmissionCheckoff).checkboxes
									.sort()
									.join(","))
					}
					onClick={submit}
				>
					{finished
						? dbSubmission?.final
							? "Submitted!"
							: "Submit"
						: dbSubmission?.final
						? "Resubmit Draft"
						: "Save Draft"}
				</Button>
				{loading && <Loading className="w-full bg-gray-300" />}
			</div>
			{error && `Error occured while saving: ${error}`}
		</>
	);
};

export default CheckBox;
