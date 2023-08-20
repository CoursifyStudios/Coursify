import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getUserData = async (
	supabase: SupabaseClient<Database>,
	profileid: string
) => {
	return await supabase
		.from("users")
		.select(`id, full_name, email, bio, year, avatar_url`)
		.eq(profileid.includes("@") ? "email" : "id", profileid)
		.single();
};

export const getBulkUserData = async (
	supabase: SupabaseClient<Database>,
	profiles: string[]
) => {
	return await supabase
		.from("users")
		.select(`id, full_name, email, bio, year, avatar_url`)
		.or(
			profiles
				.map((p) => `${p.includes("@") ? "email" : "id"}.eq."${p}"`)
				.join(",")
		);
};

export type UserDataType = Awaited<ReturnType<typeof getUserData>>;

export const updateBio = async (
	supabase: SupabaseClient<Database>,
	profileid: string,
	bio: string | null
) => {
	return await supabase.from("users").update({ bio: bio }).eq("id", profileid);
};

export const updateProfile = async (
	supabase: SupabaseClient<Database>,
	profileid: string,
	data: Partial<NewUserData>
) => {
	return await supabase.from("users").update(data).eq("id", profileid);
};
