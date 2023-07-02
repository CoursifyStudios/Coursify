import { Button } from "@/components/misc/button";
import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { IdentificationIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { Dispatch, SetStateAction, useMemo } from "react";
import { AssignmentCheckoff } from "../../assignmentCreation/three/settings.types";
import { SubmissionCheckoff } from "../submission.types";

const CheckBox: NextPage<{
	imports: {
		revisions: SubmissionCheckoff[];
		settings: AssignmentCheckoff;
		submission: SubmissionCheckoff;
		setSubmission: Dispatch<SetStateAction<SubmissionCheckoff>>;
	};
}> = ({ imports: { revisions, settings, setSubmission, submission } }) => {
	const finished = useMemo(() => {
		return (
			submission &&
			submission.checkboxes &&
			settings.checkboxes.length == submission.checkboxes.length
		);
	}, [settings.checkboxes.length, submission]);

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
			<Button className="text-white" color="bg-blue-500">
				{finished ? "Submit" : "Save"}
			</Button>
		</>
	);
};

export default CheckBox;
