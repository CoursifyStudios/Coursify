import { AssignmentSettingsTypes } from "@assignments/assignmentCreation/three/settings.types";
import { DueType } from "@assignments/assignments";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { SerializedEditorState } from "lexical";
import { Database, Json } from "../database.types";
import { SubmissionDiscussionPost } from "@/components/assignments/assignmentPanel/submission.types";
import { ArrayElementType } from "@/lib/misc/elementarraytype.types";

export const getAllAssignments = async (
	supabaseClient: SupabaseClient<Database>,
	userID: string
) => {
	return await supabaseClient
		.from("class_users")
		.select(
			`
			teacher,
			classes (
				assignments (
					*,
					submissions ( 
						final
					),
					classes (
						name, id, color, block, schedule_type
					),
					starred (
						assignment_id
					)
				)
			)
		`
		)
		.eq("user_id", userID)
		.order("due_date", {
			foreignTable: "classes.assignments",
			ascending: false,
			nullsFirst: false,
		});
};

export type AllAssignmentResponse = Awaited<
	ReturnType<typeof getAllAssignments>
>;

export type AllAssignments = Exclude<
	ArrayElementType<
		Exclude<Awaited<ReturnType<typeof getAllAssignments>>["data"], null>
	>["classes"],
	null
>["assignments"];

export const handleStarred = async (
	supabase: SupabaseClient<Database>,
	starred: boolean,
	assId: string,
	userID: string
) => {
	if (starred) {
		//create new row
		await supabase.from("starred").insert({
			user_id: userID,
			assignment_id: assId,
		});
	}
	if (!starred) {
		//delete row
		await supabase
			.from("starred")
			.delete()
			.eq("user_id", userID)
			.eq("assignment_id", assId);
	}
};

export const getAssignment = async (
	supabase: SupabaseClient<Database>,
	assignmentuuid: string,
	userID: string
) => {
	return await supabase
		.from("assignments")
		.select(
			`
		*, classes (
			name, id, color
		),
		submissions (
			content,
			final,
			created_at,
			users (
				id, full_name, avatar_url
			)
		)
		`
		)
		.order("created_at", { foreignTable: "submissions", ascending: false })
		.eq("submissions.user_id", userID)
		.eq("id", assignmentuuid)
		.single();
};

export const getTheseAssignments = async (
	supabase: SupabaseClient<Database>,
	class_id: string,
	these: string[]
) => {
	return await supabase
		.from("assignments")
		.select(
			`
        id,
        name,
        description,
        due_type,
        due_date
        `
		)
		.eq("class_id", class_id)
		.in("id", these);
	//.not("id", "in", `(${notThese})`);
};

export type AssignmentResponse = Awaited<ReturnType<typeof getAssignment>>;

//Lukas is building the world's first 7D array
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];

export const editDiscussionPost = async (
	supabase: SupabaseClient<Database>,
	content: SubmissionDiscussionPost,
	id: string
) => {
	const { assignmentType: _, ...newContent } = content;
	return await supabase
		.from("submissions")
		.update({ content: newContent as unknown as Json })
		.eq("id", id)
		.select()
		.single();
};

export interface AssignmentData {
	// I can't use extends here because I want to have data be undefined sometimes
	success: boolean;
	error?: PostgrestError;
}

export enum AssignmentTypes {
	LINK = 0,
	MEDIA = 1,
	FILE_UPLOAD = 2,
	//ASSESSMENT = 2,
	CHECKOFF = 3,
	DISCUSSION_POST = 4,
	GOOGLE = 5,
	TEXT = 6,
	ALL = 7,
}

export type NewAssignmentData = {
	name: string;
	description: string;
	content: SerializedEditorState;
	type: AssignmentTypes;
	submissionInstructions?: string;
	dueType?: DueType;
	dueDate?: Date;
	dueDay?: number;
	publishType?: DueType;
	publishDate?: Date;
	publishDay?: number;
	hidden: boolean;
	maxGrade?: number;
	settings: AssignmentSettingsTypes;
};
