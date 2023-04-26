import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
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
	// this is now goign to be designed with the idea that
	// everything (group, class, sports group, etc.) is a
	// class on the classes table. That means no more
	// ClassOrGroupObjects
	communities: string[]
) => {
	const announcements: PostgrestSingleResponse<{
		author: string;
		class_id: string | null;
		content: Json;
		id: string;
		time: string | null;
		title: string | null;
	}>[] = [];
	communities.forEach(async (community) => {
		const announcement = await supabase
			.from("announcements")
			.insert({
				author: announcementAuthor,
				title: announcementTitle,
				content: announcementContent,
				class_id: community,
			})
			.select()
			.single();
		announcements.push(announcement);
	});
	return announcements;
};
