import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getAllGroupsForUser = async (
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

export type AllGroupsResponse = Awaited<ReturnType<typeof getAllGroupsForUser>>;

export const getAllPublicGroups = async (
	supabaseClient: SupabaseClient<Database>
) => {
	return await supabaseClient
		.from("groups")
		.select(
			`
        *,
        users_groups (
            user_id, group_id
        )

        `
		)
		.eq("public", true);
};

export type PublicGroupsResponse = Awaited<
	ReturnType<typeof getAllPublicGroups>
>;

export const getGroup = async (
	supabaseClient: SupabaseClient<Database>,
	groupID: string
) => {
	return await supabaseClient
		.from("groups")
		.select(
			`
        *,
        announcements (
            *,
            users (
                avatar_url, full_name
            )
        ),
        users_groups (
            user_id, group_leader
        ),
        users (
            *
        )
    `
		)
		.eq("id", groupID)
		.single();
};

export type GroupResponse = Awaited<ReturnType<typeof getGroup>>;

export const addUserToGroup = async (
	supabaseClient: SupabaseClient<Database>,
	groupID: string,
	userID: string
) => {
	return await supabaseClient.from("users_groups").insert({
		user_id: userID,
		group_id: groupID,
		group_leader: null,
	});
};

export type PossiblyTemporaryUserGroupType = Awaited<
	ReturnType<typeof addUserToGroup>
>;
