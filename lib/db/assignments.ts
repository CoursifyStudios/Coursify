import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import supabase from "../supabase";
import { Database } from "./database.types";

const classesRelation = `classes (*)`;

export const getAllAssignments = async (
	supabaseClient: SupabaseClient<Database>
) => {
	return await supabaseClient.from("assignments").select(
		`
		name, description, id,
		${classesRelation}
		`
	);
};

export type AllAssignmentResponse = Awaited<
	ReturnType<typeof getAllAssignments>
>;

export const getAssignment = async (
	supabaseClient: SupabaseClient<Database>,
	assignmentid: number
) => {
	return await supabaseClient
		.from("assignments")
		.select(
			`
		*, ${classesRelation}
		`
		)
		.eq("id", assignmentid)
		.single();
};

export type AssignmentResponse = Awaited<ReturnType<typeof getAssignment>>;

export const newAssignment = async (
	assignment: Assignment["data"],
	classid: number
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
	console.log(data);
	if (data) {
		// amazing naming schema
		const { error: secondError } = await supabase
			.from("classes_assignments")
			.insert({ asssignment_id: data.id, class_id: classid });
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
