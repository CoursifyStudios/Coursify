import {
	AssignmentTypes,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import LinkGrading from "./link";
import {
	Submission,
	SubmissionCheckoff,
	SubmissionFileUpload,
	SubmissionLink,
	SubmissionMedia,
	SubmissionSettingsTypes,
	SubmissionText,
} from "../../assignmentPanel/submission.types";
import MediaGrading from "./media";
import FileGrading from "./file";
import CheckboxGrading from "./checkbox";
import TextGrading from "./text";

const AssignmentGradingComponents = ({
	assignmentData,
	submission: latetestSubmitted,
	latestSubmission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionSettingsTypes;
	latestSubmission: SubmissionSettingsTypes;
}) => {
	if (!assignmentData.data) return null;

	const submission = latetestSubmitted ?? latestSubmission;

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
		case AssignmentTypes.FILE_UPLOAD:
			return (
				<FileGrading
					assignmentData={assignmentData}
					submission={submission as SubmissionFileUpload}
				/>
			);
		case AssignmentTypes.CHECKOFF:
			return (
				<CheckboxGrading
					assignmentData={assignmentData}
					submission={submission as SubmissionCheckoff}
				/>
			);
		case AssignmentTypes.TEXT:
			return (
				<TextGrading
					assignmentData={assignmentData}
					submission={submission as SubmissionText}
				/>
			);
	}
};

export default AssignmentGradingComponents;
