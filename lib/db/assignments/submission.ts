import { SubmissionSettingsTypes } from "@/components/assignments/assignmentPanel/submission.types";
import { SupabaseClient, User } from "@supabase/auth-helpers-react";
import { Database, Json } from "../database.types";

export const assignmentSubmission = async (
	assignmentID: string,
	submissionData: SubmissionSettingsTypes,
	supabase: SupabaseClient<Database>,
	user: User,
	final: boolean
) => {
	const { assignmentType: _, ...toInsert } = submissionData;

	const { error } = await supabase.from("submissions").insert({
		content: toInsert as unknown as Json,
		user_id: user.id,
		assignment_id: assignmentID,
		final: final,
	});

	if (error) {
		return error;
	}
};
