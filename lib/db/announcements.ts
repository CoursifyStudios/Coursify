import { SupabaseClient } from "@supabase/supabase-js";
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
	// This is lukas approved but not bill approved
	const [parent, ...rest] = communities;

	const res = await supabase.from("announcements").insert({
		author: announcementAuthor,
		title: announcementTitle,
		content: announcementContent,
		class_id: parent,
	}).select(`
			*,
			users (
				id, full_name, avatar_url
			),
	        parent (
	            id,
	            author,
	            title,
	            content,
	            time,
	            class_id,
	            type,
	            clone_id,
	            users (
	                full_name, avatar_url
	            )
	        )`);

	if (rest.length > 0) {
		const announcements = rest.map((c) => ({
			author: announcementAuthor,
			title: announcementTitle,
			content: announcementContent,
			class_id: c,
			clone_id: res.data![0].id,
		}));
		await supabase.from("announcements").insert(announcements);
	}

	return res;
};

export type crossPostingReturn = Awaited<
	ReturnType<typeof crossPostAnnouncements>
>;
// Removes the announcement(s) that match the author, title and content.
// This is what happens when no merge table. To remove the announcement
// from just one group or class, use removeAnnouncementFromCommunity(),
// which is defined below
export const deleteAnnouncement = async (
	supabase: SupabaseClient<Database>,
	announcement: { author: string; title: string; time: string }
) => {
	// I think that +/- 2 seconds is appropriate for now, but please (honestly)
	// tell me if you think it should be longer or shorter
	const earlyDate: Date = new Date(
		new Date(announcement.time).getTime() - 2000
	);
	const laterDate: Date = new Date(
		new Date(announcement.time).getTime() + 2000
	);
	return await supabase
		.from("announcements")
		.delete()
		.eq("author", announcement.author)
		.eq("title", announcement.title)
		.gte("time", earlyDate.toISOString())
		.lte("time", laterDate.toISOString());
};

///Now using clone_id that was generated client side
export const editAnnouncement = async (
	supabase: SupabaseClient<Database>,
	oldAnnouncement: {
		id: string;
		author: string;
		title: string;
		clone_id: string | null;
	},
	newAnnouncement: { title: string; content: Json }
) => {
	return await supabase
		.from("announcements")
		.update({
			title: newAnnouncement.title,
			content: newAnnouncement.content,
		})
		.or(
			[
				`and(author.eq.${oldAnnouncement.author},id.eq.${oldAnnouncement.id})`,
				`,clone_id.eq.${oldAnnouncement.id}`,
				oldAnnouncement.clone_id ? `,id.eq.${oldAnnouncement.clone_id}` : ``,
			].join("")
		).select(`
		*,
		users (
			id, full_name, avatar_url
		),
		parent (
			id,
			author,
			title,
			content,
			time,
			class_id,
			type,
			users (
				full_name, avatar_url
			)
		)`);
};

// A bit like the deleting function above, but this one only
// removes the announcement from one group or class.
// These will have the same behavior if the announcement is
// posted to only one group or class
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

export const shareAnnouncement = async (
	supabase: SupabaseClient<Database>,
	announcementID: string,
	newAnnouncement: { author: string; title: string; content: Json },
	communities: string[]
) => {
	const announcements: {
		author: string;
		title: string | null;
		content: Json;
		class_id: string | null;
		parent: string;
		type: number;
	}[] = [];
	communities.forEach((community) => {
		announcements.push({
			author: newAnnouncement.author,
			title: newAnnouncement.title,
			content: newAnnouncement.content,
			class_id: community,
			parent: announcementID,
			type: AnnouncementType.CROSSPOST,
		});
	});
	return await supabase.from("announcements").insert(announcements).select(`
        *,
        users (
            id, full_name, avatar_url
        ),
        parent (
            id,
            author,
            title,
            content,
            time,
            class_id,
            type,
            users (
                full_name, avatar_url
            )
        )`);
};

export const postCommentOrReply = async (
	supabase: SupabaseClient<Database>,
	author: string,
	classID: string,
	announcementID: string,
	content: string,
	type: AnnouncementType
) => {
	return await supabase
		.from("announcements")
		.insert({
			author: author,
			title: content, //using title value for comments
			content: null,
			class_id: classID,
			parent: announcementID,
			type: type,
		})
		.select()
		.single();
};

export type CommentType = Awaited<ReturnType<typeof postCommentOrReply>>;

export enum AnnouncementType {
	ANNOUNCMENT = 0,
	COMMENT = 1,
	CROSSPOST = 2,
	REPLY = 3,
}

export type BasicAnnouncement = {
	author: string;
	class_id: string | null;
	content: Json;
	id: string;
	parent: string | null;
	time: string | null;
	title: string | null;
	type: number;
	users:
		| {
				id: string;
				full_name: string;
				avatar_url: string;
		  }
		| {
				id: string;
				full_name: string;
				avatar_url: string;
		  }[]
		| null;
};

export type TypeOfAnnouncements = {
	id: string;
	author: string;
	title: string | null;
	content: Json;
	time: string | null;
	type: number;
	clone_id: string | null;
	users:
		| {
				avatar_url: string;
				full_name: string;
		  }
		| {
				avatar_url: string;
				full_name: string;
		  }[]
		| null;
	parent?: {
		author: string;
		content: Json;
		id: string;
		time: string | null;
		title: string | null;
		users:
			| {
					avatar_url: string;
					full_name: string;
			  }
			| {
					avatar_url: string;
					full_name: string;
			  }[]
			| null;
		type: number;
	} | null;
};

