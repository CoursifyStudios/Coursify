import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { CommunityType } from "./classes";
//DEPRECATE SOON
export const getAllPublicGroups = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	return await supabase
		.from("classes")
		.select(
			`
        id,
        name,
        description,
        image,
        type,
        tags,
        class_users (
            user_id, class_id
        )

        `
		)
		//check that type is equal to 2 OR type is equal to 1 AND class_users contains the userID
		//.or('type.eq.2,and(type.eq.1,class_users.cs)');//fix this line
		.or(`type.eq.2,and(type.eq.1,class_users.user_id.eq.'${userID}')`);
	//.or(`type.eq.2,and(type.eq.1,class_users.cs(user_id.eq.'${userID}'))`);
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
        class_users (
            user_id, teacher
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
