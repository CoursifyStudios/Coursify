import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

export async function getAllGroups (
    supabaseClient: SupabaseClient<Database>
){
    const {data, error} = await supabaseClient
    .from("groups")
    .select(`
    *,
    users_groups (
        user_id, group_leader
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

export type AllGroupsResponse = Awaited<ReturnType<typeof getAllGroups>>;