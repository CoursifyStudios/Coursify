import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";

export interface ScheduleInterface {
	timeStart: string;
	timeEnd: string;
	block: number;
	type: number;
	specialEvent?: string;
	customColor?: string; //may as well
    
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

export function to12hourTime(timeAsString: string, includeAMPM?: boolean) {
	if (parseInt(timeAsString.substring(0, 2)) == 12) {
		return timeAsString + (includeAMPM? " PM" : "");
	} else if (parseInt(timeAsString.substring(0, 2)) <= 12) {
		return parseInt(timeAsString.substring(0, 2)) + timeAsString.substring(2) + (includeAMPM? " AM" : ""); 
	} else {
		return (
			parseInt(timeAsString.substring(0, 2)) -
			12 +
			timeAsString.substring(2) +
			(includeAMPM? " PM" : "")
		);
	}
}

export const defaultScheduleTemplates: Json[] = [
    [{"timeStart":"09:30","timeEnd":"10:55","block":1,"type":1},{"timeStart":"09:30","timeEnd":"10:55","block":1,"type":2},{"timeStart":"10:55","timeEnd":"23:40","block":2,"type":1,"specialEvent":"Lunch","customColor":""},{"timeStart":"11:05","timeEnd":"12:20","block":2,"type":2},{"timeStart":"11:50","timeEnd":"13:05","block":2,"type":1},{"timeStart":"12:20","timeEnd":"13:05","block":2,"type":2,"specialEvent":"Lunch","customColor":""},{"timeStart":"13:15","timeEnd":"14:30","block":3,"type":2,"customColor":""},{"timeStart":"13:15","timeEnd":"14:30","block":3,"type":1,"customColor":""}]
]
