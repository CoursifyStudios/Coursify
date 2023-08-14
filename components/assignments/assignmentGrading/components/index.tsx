import {
	AssignmentTypes,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import LinkGrading from "./link";
import {
	Submission,
	SubmissionFileUpload,
	SubmissionLink,
	SubmissionMedia,
	SubmissionSettingsTypes,
} from "../../assignmentPanel/submission.types";
import MediaGrading from "./media";

const AssignmentGradingComponents = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionSettingsTypes;
}) => {
	if (!assignmentData.data) return null;

	switch (assignmentData.data.type) {
		case AssignmentTypes.LINK:
			return (
				<LinkGrading
					assignmentData={assignmentData}
					submission={submission as SubmissionLink}
				/>
			);
		case AssignmentTypes.MEDIA:
			return (
				<MediaGrading
					assignmentData={assignmentData}
					submission={submission as SubmissionFileUpload}
				/>
			);
	}
};

export default AssignmentGradingComponents;
