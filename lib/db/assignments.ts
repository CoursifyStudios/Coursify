import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { SerializedEditorState } from "lexical";
import { DueType } from "../../components/complete/assignments/assignments";
import { Database } from "./database.types";

export const getAllAssignments = async (
	supabaseClient: SupabaseClient<Database>
) => {
	return await supabaseClient.from("assignments").select(
		`
		*,
		
		classes (
			name, id, color, block, schedule_type
		),
		starred (
			assignment_id
		)
		`
	);
};

export type AllAssignmentResponse = Awaited<
	ReturnType<typeof getAllAssignments>
>;

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
	assignmentuuid: string
) => {
	return await supabase
		.from("assignments")
		.select(
			`
		*, classes (
			name, id, color
		)
		`
		)
		.eq("id", assignmentuuid)
		.single();
};

export type AssignmentResponse = Awaited<ReturnType<typeof getAssignment>>;

//Lukas is building the world's first 7D array
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];

export interface AssignmentData {
	// I can't use extends here because I want to have data be undefined sometimes
	success: boolean;
	error?: PostgrestError;
}

export enum AssignmentTypes {
	LINK = 0,
	MEDIA = 1,
	ASSESSMENT = 2,
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
};
