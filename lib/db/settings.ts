import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getUserData = async (
	supabase: SupabaseClient<Database>,
	profileid: string
) => {
	return await supabase
		.from("users")
		.select(`id, name, email, bio, year`)
		.eq("id", profileid)
		.single();
};

export type UserDataType = Awaited<ReturnType<typeof getUserData>>;
