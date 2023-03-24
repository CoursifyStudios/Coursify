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
	groupid: string
) => {
	return await supabaseClient
		.from("groups")
		.select(
			`
            *,
            users_groups (
                *
            ), announcements (
                *
            )
            `
		)
		.eq("id", groupid)
		.single();
};

export type GroupResponse = Awaited<ReturnType<typeof getGroup>>;

// export const getGroupAnnouncements = async (
// 	supabaseClient: SupabaseClient<Database>,
// 	groupid: string
// ) => {
// 	return await supabaseClient
// 		.from("groups_announcements")
// 		.select(
// 			`
//             *,
//             announcements (
//                 *
//             )
//             `
// 		)
// 		.eq("group_id", groupid);
// };

// export type GroupAnnouncementsResponse = Awaited<
// 	ReturnType<typeof getGroupAnnouncements>
// >;
