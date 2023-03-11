import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import supabase from "../supabase";
import { Database } from "./database.types";

export const getAllAssignments = async (
	supabaseClient: SupabaseClient<Database>
) => {
	return await supabaseClient.from("assignments").select(
		`
		name, description, id,
		classes (
			name, id, color
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
	supabaseClient: SupabaseClient<Database>,
	assignmentuuid: string
) => {
	return await supabaseClient
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

export const newAssignment = async (
	assignment: Assignment["data"],
	classuuid: string
): Promise<AssignmentData> => {
	const { data, error } = await supabase
		.from("assignments")
		.insert(assignment)
		.select()
		.limit(1)
		.single();
	if (error) {
		return {
			success: false,
			error,
		};
	}
	if (data) {
		// amazing naming schema
		const { error: secondError } = await supabase
			.from("classes_assignments")
			.insert({ assignment_id: data.id, class_id: classuuid });
		if (secondError) {
			return {
				success: false,
				error: secondError,
			};
		}
		return { success: true };
	}
	return { success: false };
};

export interface Assignment {
	data: Database["public"]["Tables"]["assignments"]["Insert"];
}

export interface AssignmentData {
	// I can't use extends here because I want to have data be undefined sometimes
	success: boolean;
	error?: PostgrestError;
}
