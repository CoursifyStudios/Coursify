import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getAllGroups = async (
	supabaseClient: SupabaseClient<Database>,
	userID: string
) => {
	return await supabaseClient
		.from("users_groups")
		.select(
			`
    *,
    groups (
        *
    )
    `
		)
		.eq("user_id", userID);
};

export type AllGroupsResponse = Awaited<ReturnType<typeof getAllGroups>>;
