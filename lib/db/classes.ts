import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export async function getAllClasses(supabaseClient: SupabaseClient<Database>) {
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

export type AllClassesResponse = Awaited<ReturnType<typeof getAllClasses>>;

export const getClass = async (
	supabaseClient: SupabaseClient<Database>,
	classid: string
) => {
	return await supabaseClient
		.from("classes")
		.select(
			`
		*,
		assignments (
			name, description
		)
	`
		)
		.eq("id", classid)
		.single();
};

export type ClassResponse = Awaited<ReturnType<typeof getClass>>;

export interface Class {
	data: Database["public"]["Tables"]["classes"]["Row"];
}

export const getUserSchool = async (
	supabaseClient: SupabaseClient<Database>
) => {
	return await supabaseClient.from("schools").select(
		`
		name,
		users (
			username
		)
		`
	);
	// .eq("id", "1e5024f5-d493-4e32-9822-87f080ad5516")
	// .single();
};

export type UserSchoolResponse = Awaited<ReturnType<typeof getClass>>;

export const updateClass = async (
	supabaseClient: SupabaseClient<Database>,
	classid: number
) => {
	return await supabaseClient
		.from("classes")
		.update({
			description: "WE (we) look at all the LAKES (lakes)",
		})
		.eq("id", classid);
};
