import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
//DEPRECATE SOON
export const getAllPublicGroups = async (
	supabase: SupabaseClient<Database>
) => {
	return await supabase
		.from("groups")
		.select(
			`
        *,
        group_users (
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
		.from("classes")
		.select(
			`
        id,
        name,
        description,
        name_full,
        full_description,
        image,
        announcements (
            *,
            users (
                avatar_url, full_name
            )
        ),
        group_users (
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
	return await supabase.from("class_users").insert({
		user_id: userID,
		class_id: groupID,
		group_leader: null,
	});
};

export type PossiblyTemporaryUserGroupType = Awaited<
	ReturnType<typeof addUserToGroup>
>;
