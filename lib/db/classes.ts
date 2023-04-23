import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { NonNullableArray } from "../misc/misc.types";
import type { Database } from "./database.types";

export async function getAllClasses(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.from("classes").select(`
	*,
	users (
		avatar_url, id, full_name
	),
	class_users (
		user_id, teacher, grade
	),
    assignments (
        *,
        starred (
            *
        )
    )
	`);
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
	supabase: SupabaseClient<Database>,
	classid: string
) => {
	return await supabase
		.from("classes")
		.select(
			`
		*,
        announcements (
            *,
            users (
                *
            )
        ),
		assignments (
			name, description, id, due_type, due_date
		),
		class_users (
			user_id, grade, teacher
		),
		users (
			*
		)
	`
		)
		.eq("id", classid)
		.single();
};

export type ClassResponse = Awaited<ReturnType<typeof getClass>>;

export interface IndividialClass {
	data: Database["public"]["Tables"]["classes"]["Row"];
}

export const getUserSchool = async (supabase: SupabaseClient<Database>) => {
	return await supabase.from("schools").select(
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
	supabase: SupabaseClient<Database>,
	classid: string,
	updates: Database["public"]["Tables"]["classes"]["Update"]
) => {
	return await supabase.from("classes").update(updates).eq("id", classid);
};

export const getClassesForUserBasic = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	return await supabase
		.from("class_users")
		.select(
			`
    teacher,
    classes (
        id,
        name,
        type
    )`
		)
		.eq("user_id", userID);
};

export type BasicClassInfoDB = Awaited<
	ReturnType<typeof getClassesForUserBasic>
>;
