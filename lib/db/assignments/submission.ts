import { SubmissionSettingsTypes } from "@assignments/assignmentPane/submission.types";

export const submission = (
	classID: string,
	assignmentID: string,
	submissionData: SubmissionSettingsTypes
) => {
	const { assignmentType: _, ...data } = submissionData;
};
