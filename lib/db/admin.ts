import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const getUsers = async (
	supabaseClient: SupabaseClient<Database>,
	page: number,
	pageSize: number,
	id: string,
	search?: string
) => {
	const { from, to } = getRanges(page, pageSize);

	let supabaseRequest = supabaseClient.from(`schools`).select(
		`
			name, 

				users (
					id, full_name, email, year, bio, phone_number,
						enrolled (
							adminBool
						)
				)
			
			
		`
	);
	if (search !== undefined && search.length > 0) {
		supabaseRequest = supabaseRequest.or(
			[
				`full_name.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
				`email.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
			].join(","),
			{ foreignTable: "users" }
		);
	}

	return await supabaseRequest
		.range(from, to, { foreignTable: "users" })
		.eq("id", id)
		.single();
};

export type UsersResponse = Awaited<ReturnType<typeof getUsers>>;

export const getRanges = (page: number, size: number) => ({
	from: (page - 1) * size,
	to: page * size - 1,
});

export const getUsersPages = async (
	supabaseClient: SupabaseClient<Database>,
	pageSize: number,
	school: string,
	search?: string
) => {
	let supabaseRequest = supabaseClient
		.from(`schools`)
		.select(
			`users (
			count
		)`
		)
		.eq("id", school);

	if (search !== undefined && search.length > 0) {
		supabaseRequest = supabaseRequest.or(
			[
				`full_name.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
				`email.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
			].join(","),
			{ foreignTable: "users" }
		);
	}

	const { data, error } = await supabaseRequest;
	// @ts-expect-error Supabase doesn't really support this method, but theres no official way to get the sount of foreign tables as far as I can tell
	const count = data ? data[0].users[0].count : 0;

	if (error || !count) {
		throw error;
	}

	return Math.ceil(count / pageSize);
};
