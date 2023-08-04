import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { pages, topics } from "@/components/popups/feedback";

export const newFeedback = async (
	supabase: SupabaseClient<Database>,
	feedback: Feedback,
	userID: string
) => {
	return await supabase.from("feedback").insert({
		topic: topics.find((_, i) => i == feedback.topic) || "Unknown",
		affected_page: pages.find((_, i) => i == feedback.page) || "Unknown",
		title: feedback.title,
		content: feedback.content,
		code: [feedback.topic, feedback.page],
		user_id: userID,
		route: feedback.route,
	});
};

export interface Feedback {
	topic: number;
	page: number;
	title: string;
	content: string;
	route: string;
}
