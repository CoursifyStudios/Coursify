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
		return timeAsString + (includeAMPM ? " PM" : "");
	} else if (parseInt(timeAsString.substring(0, 2)) <= 12) {
		return (
			parseInt(timeAsString.substring(0, 2)) +
			timeAsString.substring(2) +
			(includeAMPM ? " AM" : "")
		);
	} else {
		return (
			parseInt(timeAsString.substring(0, 2)) -
			12 +
			timeAsString.substring(2) +
			(includeAMPM ? " PM" : "")
		);
	}
}

export function toDayOfWeek(dayAsNumber: number): string {
	if (dayAsNumber == 0) return "Sunday";
	if (dayAsNumber == 1) return "Monday";
	if (dayAsNumber == 2) return "Tuesday";
	if (dayAsNumber == 3) return "Wednesday";
	if (dayAsNumber == 4) return "Thursday";
	if (dayAsNumber == 5) return "Friday";
	if (dayAsNumber == 6) return "Saturday";
	return "";
}
