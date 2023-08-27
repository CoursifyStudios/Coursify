import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionCheckoff,
	SubmissionLink,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useState } from "react";
import { AssignmentCheckoff } from "../../assignmentCreation/three/settings.types";
import { CheckIcon } from "@heroicons/react/24/outline";

const CheckboxGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionCheckoff;
}) => {
	const [selectedLink, setSelectedLink] = useState(0);

	if (!assignmentData.data) return null;

	return (
		<>
			{(
				assignmentData.data.settings as unknown as AssignmentCheckoff
			).checkboxes.map((checkbox) => {
				const checked =
					submission.checkboxes &&
					submission.checkboxes.includes(checkbox.step);
				return (
					<div key={checkbox.step} className="flex p-3 border rounded-xl mb-2">
						<div
							className={`checkbox mr-3 mt-1 h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition  ${
								checked ? "bg-gray-300 " : "dark:bg-neutral-950"
							}`}
						>
							{checked && <CheckIcon className="h-4 w-4" />}
						</div>
						<div className="grow">
							<h3 className="font-semibold">{checkbox.name}</h3>
							<p className="text-sm">{checkbox.description}</p>
						</div>
					</div>
				);
			})}
		</>
	);
};

export default CheckboxGrading;
