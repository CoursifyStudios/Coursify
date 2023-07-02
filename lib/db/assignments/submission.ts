import { SubmissionSettingsTypes } from "@/components/complete/assignments/assignmentPanel/submission.types";

export const submission = (
	classID: string,
	assignmentID: string,
	submissionData: SubmissionSettingsTypes
) => {
	const { assignmentType: _, ...data } = submissionData;
};
