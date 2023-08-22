import {
	AssignmentTypes,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import LinkGrading from "./link";
import {
	Submission,
	SubmissionCheckoff,
	SubmissionDiscussionPost,
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
import { Json } from "@/lib/db/database.types";
import DiscussionGrading from "./discussionPost";

const AssignmentGradingComponents = ({
	assignmentData,
	submission: latetestSubmitted,
	latestSubmission,
	selectedStudent,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionSettingsTypes;
	latestSubmission: SubmissionSettingsTypes;
	selectedStudent: SelectedStudent;
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
		case AssignmentTypes.DISCUSSION_POST:
			return (
				<DiscussionGrading
					assignmentData={assignmentData}
					submission={submission as SubmissionDiscussionPost}
					selectedStudent={selectedStudent}
				/>
			);
	}
};

export default AssignmentGradingComponents;

export interface SelectedStudent {
	submissions: {
		content: Json;
		final: boolean;
		created_at: string;
		assignment_id: string;
		grade: number | null;
		id: string;
	}[];
	id: string;
	full_name: string;
	avatar_url: string;
}
