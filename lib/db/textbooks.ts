import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";
import { CoursifyFile } from "@/components/files/genericFileUpload";

export async function getTextbooks(
	supabase: SupabaseClient<Database>,
	page: number
) {
	return await supabase.from("textbooks").select(`*`);
	//.order("id", { ascending: true })
	// .range((page - 1) * 60, page * 60);
	//still need to get pagination working
}

export type TypeOfFetchedTextbooks = Awaited<ReturnType<typeof getTextbooks>>;

export async function getListings(supabase: SupabaseClient<Database>) {
	return await supabase.from("listings").select(`
    *,
    users(
        id,
        full_name,
        avatar_url,
        email
    )`);
}

export async function createListing(
	supabase: SupabaseClient<Database>,
	listing: {
		textbook: string;
		seller: string;
		condition: number;
		info: string;
		pictures: CoursifyFile[];
		price: number;
		pricing_flexible: boolean;
	}
) {
	const newFiles = await Promise.all(
		listing.pictures.map(async (coursifyFile) => {
			if (coursifyFile.file) {
				await supabase.storage
					.from("ugc")
					.upload(`textbooks/${coursifyFile.dbName}`, coursifyFile.file);
				const withLink = {
					...coursifyFile,
					link: `https://cdn.coursify.one/storage/v1/object/public/ugc/textbooks/${coursifyFile.dbName}`,
				};
				const { file: _, ...withoutFile } = withLink;
				return withoutFile;
			}
		})
	);

	return await supabase
		.from("listings")
		.insert({
			...listing,
			pictures: newFiles as unknown as Json[],
		})
		.select()
		.single();
}

export async function editListing(
	supabase: SupabaseClient<Database>,
	id: string,
	oldPictures: string[] | null,
	listing: {
		condition: number;
		info: string;
		pictures: CoursifyFile[];
		price: number;
		pricing_flexible: boolean;
	}
) {
	const newFileLinks = listing.pictures?.map(
		(file) => `/textbooks/${file.dbName}`
	);
	//removing any no longer wanted files
	if (oldPictures) {
		await supabase.functions.invoke("delete-file", {
			body: {
				path: oldPictures.filter((oldFile) => newFileLinks?.includes(oldFile)),
			},
		});
	}
	const newFiles = listing.pictures
		? await Promise.all(
				listing.pictures.map(async (coursifyFile) => {
					if (coursifyFile.file) {
						await supabase.storage
							.from("ugc")
							.upload(`textbooks/${coursifyFile.dbName}`, coursifyFile.file);
						const withLink = {
							...coursifyFile,
							link: `https://cdn.coursify.one/storage/v1/object/public/ugc/textbooks/${coursifyFile.dbName}`,
						};
						const { file: _, ...withoutFile } = withLink;
						return withoutFile;
					} else {
						return coursifyFile;
					}
				})
		  )
		: [];
	return await supabase
		.from("listings")
		.update({
			...listing,
			pictures: newFiles ? (newFiles as unknown as Json[]) : [],
		})
		.eq("id", id)
		.select()
		.single();
}

export async function deleteListing(
	supabase: SupabaseClient<Database>,
	listingID: string,
	files: string[]
) {
	if (files && files.length > 0) {
		await supabase.functions.invoke("delete-file", {
			body: {
				path: files,
			},
		});
	}

	return await supabase
		.from("listings")
		.delete()
		.eq("id", listingID)
		.select()
		.single();
}

export async function getListingsForBook(
	supabase: SupabaseClient<Database>,
	book: string
) {
	return await supabase
		.from("listings")
		.select(
			`*,
        textbooks(*),
        users(
            id,
            avatar_url,
            full_name,
            email
        )`
		)
		.eq("textbook", book);
}

export async function getAllListings(supabase: SupabaseClient<Database>) {
	return await supabase.from("listings").select(`*,
    textbooks(*),
    users(
        id,
        avatar_url,
        full_name,
        email
    )`);
}

export enum Condition {
	Poor = 1,
	Fair = 2,
	Good = 3,
	Very_Good = 4,
	Fine = 5,
	As_New = 6,
}

export function handleConditions(condition: number) {
	switch (condition) {
		case 1:
			return "Poor";
		case 2:
			return "Fair";
		case 3:
			return "Good";
		case 4:
			return "Very Good";
		case 5:
			return "Fine";
		case 6:
			return "As New";
	}
}
