import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";

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
		announcements.concat(announcement);
	});
	return announcements;
};
// Removes the announcement(s) that match the author, title and content.
// This is what happens when no merge table. To remove the announcement
// from just one group or class, use removeAnnouncementFromCommunity(),
// which is defined below
export const deleteAnnouncement = async (
	supabase: SupabaseClient<Database>,
	announcement: { author: string; title: string; time: string }
) => {
    console.log(announcement.time);
	return await supabase
		.from("announcements")
		.delete()
		.eq("author", announcement.author)
		.eq("title", announcement.title)
        .gte("time", announcement.time);
};

export const editAnnouncement = async (
	supabase: SupabaseClient<Database>,
	oldAnnouncement: { author: string; content: Json; title: string },
	newAnnouncement: { content: Json; title: string }
) => {
	return await supabase
		.from("announcements")
		.update({
			content: newAnnouncement.content,
			title: newAnnouncement.title,
		})
		.eq("author", oldAnnouncement.author)
		.eq("content", oldAnnouncement.content)
		.eq("title", oldAnnouncement.title)
		.select();
};

export const removeAnnouncementFromCommunity = async (
	supabase: SupabaseClient<Database>,
	announcementID: string,
	communityID: string
) => {
	return await supabase
		.from("announcements")
		.delete()
		.eq("id", announcementID)
		.eq("class_id", communityID)
		.select();
};
