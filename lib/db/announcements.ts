import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";

export const createNewAnnouncement = async (
	supabaseClient: SupabaseClient<Database>,
	announcementAuthor: string,
	announcementTitle: string,
	announcementContent: Json
) => {
	return await supabaseClient.from("announcements").insert({
		author: announcementAuthor,
		title: announcementTitle,
		content: announcementContent,
	});
};
