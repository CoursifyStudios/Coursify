import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";

export const createNewAnnouncement = async (
	supabase: SupabaseClient<Database>,
	announcementAuthor: string,
	announcementTitle: string,
	announcementContent: Json,
	communityid: string,
	trueIfClass: boolean
) => {
	const announcementData = await supabase
		.from("announcements")
		.insert({
			author: announcementAuthor,
			title: announcementTitle,
			content: announcementContent,
		})
		.select()
		.single();
	if (trueIfClass) {
		//better than trying both tables
		return await supabase.from("classes_announcements").insert({
			class_id: communityid,
			announcement_id: announcementData.data?.id!,
		});
	} else {
		return await supabase.from("groups_announcements").insert({
			announcement_id: announcementData.data?.id!,
			group_id: communityid,
		});
	}
};

export const crossPostAnnouncements = async (
	supabase: SupabaseClient<Database>,
	announcementAuthor: string,
	announcementTitle: string,
	announcementContent: Json,
	communities: ClassOrGroupObject[]
) => {
	const announcementData = await supabase
		.from("announcements")
		.insert({
			author: announcementAuthor,
			title: announcementTitle,
			content: announcementContent,
		})
		.select()
		.single();
	communities.forEach(async (community) => {
		if (community.trueIfClass) {
			//better than trying both tables
			const thing = await supabase.from("classes_announcements").insert({
				class_id: community.id,
				announcement_id: announcementData.data?.id!,
			});
		} else {
			const thing = await supabase.from("groups_announcements").insert({
				announcement_id: announcementData.data?.id!,
				group_id: community.id,
			});
		}
	});
	return announcementData;
};

export const getClassesAndGroups = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	return await supabase
		.from("users")
		.select(
			`
        id, 
        users_classes (
            *,
            classes (
                name
            )
        ), 
        users_groups (
            *,
            groups (
                name
            )
        )
        `
		)
		.eq("id", userID)
		.single();
};
export interface ClassOrGroupObject {
	id: string;
	name: string;
	trueIfClass: boolean;
}
