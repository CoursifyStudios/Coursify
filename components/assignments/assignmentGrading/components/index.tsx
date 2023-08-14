import {
	AssignmentTypes,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import LinkGrading from "./link";
import {
	Submission,
	SubmissionLink,
	SubmissionSettingsTypes,
} from "../../assignmentPanel/submission.types";

const AssignmentGradingComponents = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionSettingsTypes;
}) => {
	if (!assignmentData.data) return null;

	if (assignmentData.data.type == AssignmentTypes.LINK) {
		return (
			<LinkGrading
				assignmentData={assignmentData}
				submission={submission as SubmissionLink}
			/>
		);
	}
};

export default AssignmentGradingComponents;
