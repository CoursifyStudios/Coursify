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
	data?: unknown;
}

export interface Class {
	data: Database["public"]["Tables"]["classes"]["Row"];
}

export const getUserSchool = async (
	supabaseClient: SupabaseClient<Database>
) => {
	const { data, error } = await supabaseClient.from("schools").select(
		`
		name,
		users (
			username
		)
		`
	);
	// .eq("id", "1e5024f5-d493-4e32-9822-87f080ad5516")
	// .single();
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

export const getAllAssignments = async (
	supabaseClient: SupabaseClient<Database>
) => {
	const { data, error } = await supabaseClient.from("assignments").select(
		`
		name, description
		`
	);
	// .eq("id", "1e5024f5-d493-4e32-9822-87f080ad5516")
	// .single();
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
