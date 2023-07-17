import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getUserData = async (
	supabase: SupabaseClient<Database>,
	profileid: string
) => {
	return await supabase
		.from("users")
		.select(`id, full_name, email, bio, year, avatar_url`)
		.eq("id", profileid)
		.single();
};

export type UserDataType = Awaited<ReturnType<typeof getUserData>>;

export const updateBio = async (
	supabase: SupabaseClient<Database>,
	profileid: string,
	bio: string | null
) => {
	return await supabase.from("users").update({ bio: bio }).eq("id", profileid);
};
