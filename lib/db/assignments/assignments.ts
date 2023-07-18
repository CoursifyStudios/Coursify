import { AssignmentSettingsTypes } from "@assignments/assignmentCreation/three/settings.types";
import { DueType } from "@assignments/assignments";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { SerializedEditorState } from "lexical";
import { Database } from "../database.types";

export const getAllAssignments = async (
	supabaseClient: SupabaseClient<Database>,
	page: number,
	filter?: number
) => {
	let query = supabaseClient.from("assignments").select(
		`
		*,
		classes (
			name, id, color, block, schedule_type
		),
		starred (
			assignment_id
		)
		`, {
			count: "exact",
		}
	).range(page * 10, (page + 1) * 10 - 1);

	if (filter != undefined) {
		switch (filter) {
			case 0: {
				// Not done, Waiting on Lukas to reply
				// I'm guessing it sorts by starred first then due date?
				// How the fuck do I sort where it checks if the assignment is starred or not
				break;
			}
			case 1: {
				// Due by closest
				query = query.order("due_date", { ascending: true })
				break;
			}
			case 2: {
				// Due by farthest
				query = query.order("due_date", { ascending: false })
				break;
			}
		}
	}

	return await query;
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
		),
		submissions (
			content,
			final,
			created_at
		)
		`
		)
		.order("created_at", { foreignTable: "submissions", ascending: false })
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
