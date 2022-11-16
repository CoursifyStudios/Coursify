import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export async function loadData(
	supabaseClient: SupabaseClient<Database>
): Promise<AllClassData> {
	const { data, error } = await supabaseClient.from("classes").select("*");
	if (!error) {
		return {
			success: true,
			data: data,
		};
	} else {
		return {
			success: false,
			error: error,
		};
	}
}

export const getClass = async (
	supabaseClient: SupabaseClient<Database>,
	classid: number
): Promise<ClassData> => {
	const { data, error } = await supabaseClient
		.from("classes")
		.select(
			`
		name,
		assignments (
			name, description
		)
	`
		)
		.eq("id", classid)
		.single();
	if (!error) {
		return {
			success: true,
			data: data,
		};
	} else {
		return {
			success: false,
			error: error,
		};
	}
};

export interface AllClassData {
	success: boolean;
	error?: PostgrestError;
	data?: Database["public"]["Tables"]["classes"]["Row"][];
}

export interface ClassData {
	success: boolean;
	error?: PostgrestError;
	data?: Database["public"]["Tables"]["classes"]["Row"];
}

export interface Class {
	data: Database["public"]["Tables"]["classes"]["Row"];
}
