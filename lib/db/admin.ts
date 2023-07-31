import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { ReturnedUser } from "@/pages/admin/[id]";

export const getUsers = async (
	supabase: SupabaseClient<Database>,
	page: number,
	pageSize: number,
	id: string,
	search?: string
) => {
	const { from, to } = getRanges(page, pageSize);

	let supabaseRequest = supabase.from(`schools`).select(
		`
			name, id,
				users (
					id, full_name, email, year, bio, phone_number, student_id, avatar_url,
					relationships (
						parent_id, student_id
					),
					enrolled (
						admin_bool
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

				// breaks search completly for some reason
				// `id.ilike."%${search
				// 	.replace(/"/g, '\\"')
				// 	.replace(/\*/g, "\\*")
				// 	.replace(/\%/g, "*")}%"`,
			].join(","),
			{ foreignTable: "users" }
		);
	}

	return await supabaseRequest
		.range(from, to, { foreignTable: "users" })
		.eq("id", id)
		.eq("users.enrolled.school_id", id)
		.order("full_name", { foreignTable: "users", ascending: true })
		// Ordering on foreign tables doesn't affect the ordering of the parent table. -supabase
		// why???
		// .order("admin_bool", {
		// 	foreignTable: "users.enrolled",
		// 	ascending: false,
		// 	nullsFirst: false,
		// })
		.limit(1)
		.single();
};

// export const deleteUser = async (
// 	supabaseClient: SupabaseClient<Database>,
// 	id: string
// ) => {
// 	return await supabaseClient.from("users").delete().eq("id", id);
// };

export const setAdmin = async (
	supabase: SupabaseClient<Database>,
	ids: string[],
	admin_bool: boolean,
	schoolID: string
) => {
	return await supabase
		.from("enrolled")
		.upsert(
			ids.map((id) => {
				return { user_id: id, admin_bool, school_id: schoolID };
			})
		)
		.eq("school_id", schoolID);
};

export type UsersResponse = Awaited<ReturnType<typeof getUsers>>;

export const getRanges = (page: number, size: number) => ({
	from: (page - 1) * size,
	to: page * size - 1,
});

export const getUsersPages = async (
	supabase: SupabaseClient<Database>,
	pageSize: number,
	school: string,
	search?: string
) => {
	let supabaseRequest = supabase
		.from(`schools`)
		.select(
			`id, users (
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
				// breaks search completly for some reason
				// I'm an idiot, of cose this breaks, probably needs classes.id lol
				// `id.ilike."%${search
				// 	.replace(/"/g, '\\"')
				// 	.replace(/\*/g, "\\*")
				// 	.replace(/\%/g, "*")}%"`,
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

export const updateUser = async (
	supabase: SupabaseClient<Database>,
	id: string,
	modify: "full_name" | "email" | "phone_number" | "year" | "student_id",
	content: string
) => {
	return await supabase
		.from("users")
		.update({ [modify]: content })
		.eq("id", id);
};

export const updateClass = async (
	supabase: SupabaseClient<Database>,
	id: string,
	modify: "name" | "name_full" | "image" | "block" | "schedule_type" | "room",
	content: string
) => {
	return await supabase
		.from("classes")
		.update({
			[modify]:
				modify == "block" || modify == "schedule_type"
					? parseInt(content)
					: content,
		})
		.eq("id", id);
};

export const getClasses = async (
	supabase: SupabaseClient<Database>,
	page: number,
	pageSize: number,
	id: string,
	search?: string
) => {
	const { from, to } = getRanges(page, pageSize);

	let supabaseRequest = supabase.from(`schools`).select(
		`
			id,
				classes (
					id, name, description, block, schedule_type, name_full, room, color, full_description, classpills, image,
					users (
						id, full_name, email, avatar_url,
						class_users (
							teacher, main_teacher, class_id
						)
					)
				)
		`
	);
	if (search !== undefined && search.length > 0) {
		supabaseRequest = supabaseRequest.or(
			[
				`classes.name.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
				`classes.id.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
			].join(","),
			{ foreignTable: "classes" }
		);
	}

	return await supabaseRequest
		.range(from, to, { foreignTable: "classes" })
		.eq("id", id)
		.eq("classes.school", id)
		// Only fetches classes since we store groups in the same table
		.eq("classes.type", 0)
		.order("name", { foreignTable: "classes", ascending: true })
		.limit(1)
		.single();
};

export const getClassesPages = async (
	supabase: SupabaseClient<Database>,
	pageSize: number,
	school: string,
	search?: string
) => {
	let supabaseRequest = supabase
		.from(`schools`)
		.select(
			`id, classes (
			count
		)`
		)
		.eq("id", school);

	if (search !== undefined && search.length > 0) {
		supabaseRequest = supabaseRequest.or(
			[
				`classes.name.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
				`classes.id.ilike."%${search
					.replace(/"/g, '\\"')
					.replace(/\*/g, "\\*")
					.replace(/\%/g, "*")}%"`,
			].join(","),
			{ foreignTable: "classes" }
		);
	}
	const { data, error } = await supabaseRequest;
	// @ts-expect-error Supabase doesn't really support this method, but theres no official way to get the sount of foreign tables as far as I can tell
	const count = data ? data[0].classes[0].count : 0;

	if (error || !count) {
		throw error;
	}

	return Math.ceil(count / pageSize);
};

export const updateClassUsers = async (
	supabase: SupabaseClient<Database>,
	classID: string,
	users: ReturnedUser[],
	initialUsers: ReturnedUser[]
) => {
	const u = Array.isArray(users) ? users : [users];
	return await supabase.from("class_users").upsert(
		u.map((mappedUser) => ({
			main_teacher: mappedUser.main_teacher,
			user_id: mappedUser.id,
			class_id: classID,
			teacher: mappedUser.teacher,
		}))
	);
};
