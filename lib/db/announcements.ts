import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";
import { CoursifyFile } from "@/components/files/genericFileUpload";

export const postAnnouncements = async (
	supabase: SupabaseClient<Database>,
	announcementAuthor: string,
	announcementTitle: string,
	announcementContent: Json,
	announcementFiles: CoursifyFile[] | null,
	communities: string[]
) => {
	let cloneID: string | null = null;
	const announcements: {
		author: string;
		class_id: string | null;
		content: Json | null;
		files: Json[] | null;
		title: string | null;
		clone_id: string | null;
	}[] = [];
	if (communities.length > 1) {
		cloneID = crypto.randomUUID();
	}
	const newFiles = announcementFiles
		? await Promise.all(
				announcementFiles.map(async (coursifyFile) => {
					if (coursifyFile.file) {
						await supabase.storage
							.from("ugc")
							.upload(
								`announcements/${coursifyFile.dbName}`,
								coursifyFile.file
							);
						const withLink = {
							...coursifyFile,
							link: `https://cdn.coursify.one/storage/v1/object/public/ugc/announcements/${coursifyFile.dbName}`,
						};
						const { file: _, ...withoutFile } = withLink;
						return withoutFile;
					}
				})
		  )
		: [];
	communities.forEach((community) => {
		announcements.push({
			author: announcementAuthor,
			title: announcementTitle,
			content: announcementContent,
			files: newFiles as unknown as Json[],
			class_id: community,
			clone_id: cloneID,
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
                clone_id,
                users (
                    full_name, avatar_url
                )
            )`);
};

export type postingReturn = Awaited<ReturnType<typeof postAnnouncements>>;
// Removes the announcement(s) that match the author and title.
// This is what happens when no merge table. To remove the announcement
// from just one group or class, use removeAnnouncementFromCommunity(),
// which is defined below
export const deleteAnnouncement = async (
	supabase: SupabaseClient<Database>,
	announcement: {
		id: string;
		author: string;
		title: string;
		files: string[]; //for deleting them
		clone_id: string | null;
	}
) => {
	if (announcement.files.length > 0) {
		await supabase.functions.invoke("delete-file", {
			body: {
				path: announcement.files,
			},
		});
	}
	return await supabase
		.from("announcements")
		.delete()
		// .eq("author", announcement.author)
		// .eq("title", announcement.title)
		.eq(
			announcement.clone_id ? "clone_id" : "id",
			announcement.clone_id ? announcement.clone_id : announcement.id
		);
};

///Now using clone_id that was generated client side
export const editAnnouncement = async (
	supabase: SupabaseClient<Database>,
	oldAnnouncement: {
		id: string;
		author: string;
		title: string;
		files: string[] | null;
		clone_id: string | null;
	},
	newAnnouncement: {
		title: string;
		content: Json | null;
		files: CoursifyFile[] | null;
	}
) => {
	const newFileLinks = newAnnouncement.files?.map((file) => file.dbName);
	//removing any no longer wanted files
	if (oldAnnouncement.files) {
		await supabase.functions.invoke("delete-file", {
			body: {
				path: oldAnnouncement.files.filter(
					(oldFile) => !newFileLinks?.includes(oldFile)
				),
			},
		});
	}
	const newFiles = newAnnouncement.files
		? await Promise.all(
				newAnnouncement.files.map(async (coursifyFile) => {
					if (coursifyFile.file) {
						await supabase.storage
							.from("ugc")
							.upload(
								`announcements/${coursifyFile.dbName}`,
								coursifyFile.file
							);
						const withLink = {
							...coursifyFile,
							link: `https://cdn.coursify.one/storage/v1/object/public/ugc/announcements/${coursifyFile.dbName}`,
						};
						const { file: _, ...withoutFile } = withLink;
						return withoutFile;
					} else {
						return coursifyFile;
					}
				})
		  )
		: [];
	//not the most elegant, sure, but it works an only uses one request. Until we get an SQL function, we use this. I'm Bill, this is my pr,
	return await supabase
		.from("announcements")
		.update({
			title: newAnnouncement.title,
			content: newAnnouncement.content,
			files: newFiles as unknown as Json[],
		})
		// Because teachers can now edit & delete other people's posts,
		// these checks no longer are helpful. This does mean though that
		// clone_id has to work!
		// .eq("author", oldAnnouncement.author)
		// .eq("title", oldAnnouncement.title)
		.eq(
			oldAnnouncement.clone_id ? "clone_id" : "id",
			oldAnnouncement.clone_id ? oldAnnouncement.clone_id : oldAnnouncement.id
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
                clone_id,
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
	communityID: string,
	files?: string[] //only delete files when we know that this is the only one...?
) => {
	if (files) {
		await supabase.functions.invoke("delete-file", {
			body: {
				path: files,
			},
		});
	}

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
	newAnnouncement: {
		author: string;
		title: string;
		content: Json;
		files: CoursifyFile[] | null;
	},
	communities: string[]
) => {
	const announcements: {
		author: string;
		title: string | null;
		content: Json;
		files: Json[] | null;
		class_id: string | null;
		parent: string;
		type: number;
	}[] = [];
	communities.forEach((community) => {
		announcements.push({
			author: newAnnouncement.author,
			title: newAnnouncement.title,
			content: newAnnouncement.content,
			files: newAnnouncement.files as unknown as Json[],
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
	ANNOUNCEMENT = 0,
	COMMENT = 1,
	CROSSPOST = 2,
	REPLY = 3,
}

export type BasicAnnouncement = {
	author: string;
	class_id: string | null;
	content: Json;
	files: CoursifyFile[] | null;
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
	files: CoursifyFile[] | null;
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
		files: CoursifyFile[] | null;
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
