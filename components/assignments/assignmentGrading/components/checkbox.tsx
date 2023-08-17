import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionCheckoff,
	SubmissionLink,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useState } from "react";
import { AssignmentCheckoff } from "../../assignmentCreation/three/settings.types";

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
			{submission.checkboxes}
			{(
				assignmentData.data.settings as unknown as AssignmentCheckoff
			).checkboxes.map((checkbox) => {
				const checked =
					submission &&
					submission.checkboxes &&
					submission.checkboxes.includes(checkbox.step);

				<div key={checkbox.step}>{checkbox.teacher}</div>;
			})}
		</>
	);
};

export default CheckboxGrading;
