import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { CommunityType } from "./classes";
export const getAllPublicGroups = async (
	supabase: SupabaseClient<Database>
) => {
	return await supabase
		.from("classes")
		.select(
			`
        id,
        name,
        image,
        type,
        tags,
        class_users (
            user_id, class_id
        )

        `
		)
		//check that type is equal to 2 OR type is equal to 1 AND class_users contains the userID
		//turns out that above thing is impossible right now... I can't use the or filter but I think that
		//we can use rls for this part instead --> people can view groups that are public or that they are in

		//for now it is just groups and more group types
		.gte("type", CommunityType.SCHOOLWIDE_GROUP)
		.limit(250);
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
            id,
            author,
            title,
            content,
            time,
            class_id,
            type,
            users (
                avatar_url, full_name
            ),
            parent (
                *,
                users (
                    id, full_name, avatar_url
                )
            ),
            comments (
                id,
                created_at,
                content,
                announcement_id,
                author (
                    id, full_name, avatar_url
                )
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
		teacher: false,
	});
};

export type PossiblyTemporaryUserGroupType = Awaited<
	ReturnType<typeof addUserToGroup>
>;
