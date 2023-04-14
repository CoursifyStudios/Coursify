import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getAllGroupsForUser = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	return await supabase
		.from("group_users")
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
	supabase: SupabaseClient<Database>
) => {
	return await supabase
		.from("groups")
		.select(
			`
        *,
        group_user (
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
	supabase: SupabaseClient<Database>,
	groupID: string
) => {
	return await supabase
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
        group_user (
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
	supabase: SupabaseClient<Database>,
	groupID: string,
	userID: string
) => {
	return await supabase.from("group_user").insert({
		user_id: userID,
		group_id: groupID,
		group_leader: null,
	});
};

export type PossiblyTemporaryUserGroupType = Awaited<
	ReturnType<typeof addUserToGroup>
>;
