import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";

export const createNewAnnouncement = async (
	supabaseClient: SupabaseClient<Database>,
	announcementAuthor: string,
	announcementTitle: string,
	announcementContent: Json,
	communityid: string,
	trueIfClass: boolean
) => {
	const announcementData = await supabaseClient
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
		return await supabaseClient.from("classes_announcements").insert({
			class_id: communityid,
			announcement_id: announcementData.data?.id!,
		});
	} else {
		return await supabaseClient.from("groups_announcements").insert({
			announcement_id: announcementData.data?.id!,
			group_id: communityid,
		});
	}
};

export const crossPostAnnouncements = async (
	supabaseClient: SupabaseClient<Database>,
	announcementAuthor: string,
	announcementTitle: string,
	announcementContent: Json,
	communities: ClassOrGroupObject[]
) => {
	const announcementData = await supabaseClient
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
			const thing = await supabaseClient.from("classes_announcements").insert({
				class_id: community.id,
				announcement_id: announcementData.data?.id!,
			});
		} else {
			const thing = await supabaseClient.from("groups_announcements").insert({
				announcement_id: announcementData.data?.id!,
				group_id: community.id,
			});
		}
	});
	return announcementData;
};

export interface ClassOrGroupObject {
	id: string;
	name: string;
	trueIfClass: boolean;
}
