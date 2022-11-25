import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
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
	supabaseClient: SupabaseClient<Database>,
	day: unknown,
	scheduleDataToUse: ScheduleInterface[]
) => {
	return await supabaseClient.from("schedule").insert({
		date: day as string,
		schedule_items: JSON.parse(JSON.stringify(scheduleDataToUse)) as Json,
	}); //This is so unbelievably stup-
};

export type NewSchedule = Awaited<ReturnType<typeof createNewSchedule>>;

export function to12hourTime(timeAsString: string) {
	if (parseInt(timeAsString.substring(0, 2)) <= 12) {
		return (
			parseInt(timeAsString.substring(0, 2)) + timeAsString.substring(2) + " AM"
		);
	} else {
		return (
			parseInt(timeAsString.substring(0, 2)) -
			12 +
			timeAsString.substring(2) +
			" PM"
		);
	}
}