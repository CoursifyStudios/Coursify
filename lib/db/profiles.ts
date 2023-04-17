import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getProfile = async (
	supabase: SupabaseClient<Database>,
	profileid: string
) => {
	return await supabase
		.from("users")
		.select(
			`
			*, 
			user_achievements (
				*, 
				achievements (
					*
				)
			)
			
		`
		)
		.eq("id", profileid)
		.single();
};

export type ProfilesResponse = Awaited<ReturnType<typeof getProfile>>;
