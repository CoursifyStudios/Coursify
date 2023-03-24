import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getProfile = async (
	supabaseClient: SupabaseClient<Database>,
	profileid: string
) => {
	return await supabaseClient
		.from("users")
		.select(
			`
			*, 
			users_achievements (
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
