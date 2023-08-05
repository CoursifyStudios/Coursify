import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";

export const fetchMoreAgendas = async (
	supabase: SupabaseClient<Database>,
	classID: string,
	agendas: string[],
	date: string,
	fetchFuture: boolean
) => {
	return await supabase
		.from("agendas")
		.select(`*`)
		.eq("class_id", classID)
		.filter("date", fetchFuture ? "gte" : "lte", date) // grr
		.not("id", "in", `(${agendas as string[]})`)
		.limit(10);
};

export const createAgenda = async (
	supabase: SupabaseClient<Database>,
	class_id: string,
	date: string,
	description: Json,
	assignments: string[]
) => {
	return await supabase
		.from("agendas")
		.insert({
			class_id,
			description,
			date,
			assignments,
		})
		.select()
		.single();
};

export const deleteAgenda = async (
	supabase: SupabaseClient<Database>,
	id: string
) => {
	return await supabase.from(`agendas`).delete().eq("id", id).select().single();
};

export const editAgenda = async (
	supabase: SupabaseClient<Database>,
	id: string,
	newData: {
		date: string;
		description: Json;
		assignments: string[];
	}
) => {
	return await supabase
		.from("agendas")
		.update(newData)
		.eq("id", id)
		.select()
		.single();
};

export const searchDB = async (
	supabase: SupabaseClient<Database>,
	query: string,
	excludeThese?: string[]
) => {
	return await supabase
		.from("assignments")
		.select()
		.not("id", "in", `(${excludeThese as string[]})`)
		.ilike(
			"name",
			`%${query
				.replace(/"/g, '\\"')
				.replace(/\*/g, "\\*")
				.replace(/\%/g, "*")}%"`
		)
		.limit(10);
};
