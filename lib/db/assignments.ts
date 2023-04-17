import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import supabase from "../supabase";
import { Database } from "./database.types";
import { DueType } from "../../components/complete/assignments";

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
	dbStarred: boolean,
	assId: string,
	userID: string
): Promise<boolean> => {
	if (starred == dbStarred) {
		return dbStarred;
	}
	if (starred && !dbStarred) {
		//create new row
		await supabase.from("starred").insert({
			user_id: userID,
			assignment_id: assId,
		});
		return starred;
	}
	if (!starred && dbStarred) {
		//delete row
		await supabase
			.from("starred")
			.delete()
			.eq("user_id", userID)
			.eq("assignment_id", assId);
		return starred;
	}
	return false;
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

export type AssignmentTypes =
	| "link"
	| "media"
	| "test"
	| "check"
	| "post"
	| "google";

export type NewAssignmentData = {
	name: string;
	description: string;
	submission: string;
	dueType?: DueType;
	dueDate?: Date;
	publishType?: DueType;
	publishDate?: Date;
};
