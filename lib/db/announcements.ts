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
	console.log(
		announcementAuthor,
		announcementTitle,
		announcementContent,
		communities
	);
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
		console.log(announcement); //remove when rls si fixed
	});
	return announcements;
};
