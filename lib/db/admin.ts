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

	return await supabaseRequest.range(from, to).eq("id", id).single();
};

export type UsersResponse = Awaited<ReturnType<typeof getUsers>>;

const getRanges = (page: number, size: number) => ({
	from: (page - 1) * size,
	to: page * size - 1,
});

export const getPages = async (
	supabaseClient: SupabaseClient<Database>,
	pageSize: number,
	search?: string
) => {
	let supabaseRequest = supabaseClient
		.from("users")
		.select("*", { count: "estimated" });

	if (search !== undefined && search.length > 0) {
		supabaseRequest = supabaseRequest.or(
			[
				`name.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
				`description.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
			].join(",")
		);
	}

	const { data, error, count } = await supabaseRequest;

	if (error || !count) {
		throw error;
	}

	return Math.ceil(count / pageSize);
};
