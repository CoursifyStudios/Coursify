import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import supabase from "../supabase";
import { Database, Json } from "./database.types";

export interface ScheduleInterface {
	timeStart: string;
	timeEnd: string;
	block: number;
	type: number;
	//specialEvent?: string;
}

export async function getSchedule(
	supabaseClient: SupabaseClient<Database>,
	day: Date
) {
	return await supabaseClient //when the response comes back..
		.from("schedule")
		.select() //This should select everything, I think. It might have to be '*, $(something)', but I have no idea
		.eq("date", day.toISOString())
		.single();
}

export type ScheduleData = Awaited<ReturnType<typeof getSchedule>>;

export const createNewSchedule = async (
	day: unknown,
	scheduleDataToUse: ScheduleInterface[]
): Promise<SchedulePromise> => {
	const { data, error } = await supabase
		.from("schedule")
		.insert({
			date: day as string,
			schedule_items: JSON.parse(JSON.stringify(scheduleDataToUse)) as Json,
		}) //This is so unbelievably stup-
		.select()
		.single();
	if (!error) {
		return {
			success: true,
			data: data,
		};
	} else {
		return {
			success: false,
			error: error,
		};
	}
};

export interface SchedulePromise {
	//idk what im doing this is just what Lukas' looked like
	success: boolean;
	error?: PostgrestError;
	data?: unknown;
}
