import { SupabaseClient } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
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
		.from("days_schedule")
		.select(
			`
        *,
        schedule_templates (
            *
        )`
		) //This should select everything, I think. It might have to be '*, $(something)', but I have no idea
		.eq("date", day.toISOString())
		.single();
}

export type ScheduleData = Awaited<ReturnType<typeof getSchedule>>;

export interface TemplateInterface {
	id: number;
	schedule_items: Json;
	name: string;
}
export async function getScheduleTemplates(
	supabaseClient: SupabaseClient<Database>
) {
	return await supabaseClient.from("schedule_templates").select(`*`);
}

export type ScheduleTemplatesDB = Awaited<
	ReturnType<typeof getScheduleTemplates>
>;

export const createNewSchedule = async (
	supabaseClient: SupabaseClient<Database>,
	day: unknown,
	template: number | null,
	scheduleDataToUse: ScheduleInterface[] | null
) => {
	return await supabaseClient.from("days_schedule").insert({
		date: day as string,
		template: template,
		schedule_items: scheduleDataToUse
			? (JSON.parse(JSON.stringify(scheduleDataToUse)) as Json)
			: null,
	}); //This is so unbelievably stup-
};

export type NewSchedule = Awaited<ReturnType<typeof createNewSchedule>>;

export const createNewTemplate = async (
	supabaseClient: SupabaseClient<Database>,
	nameToUse: string,
	scheduleDataToUse: ScheduleInterface[]
) => {
	return await supabaseClient.from("schedule_templates").insert({
		schedule_items: JSON.parse(JSON.stringify(scheduleDataToUse)) as Json,
		name: nameToUse,
	});
};

export type NewTemplate = Awaited<ReturnType<typeof createNewTemplate>>;

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

export function dayPlus(day: Date, add: number) {
	const newDay = new Date(day.getTime());
	newDay.setDate(day.getDate() + add);
	return newDay;
}

export const setThisSchedule = (
	scheduleData: ScheduleData,
	setter?: Dispatch<SetStateAction<ScheduleInterface[] | undefined>>
) => {
	if (setter)
		setter(
			!scheduleData.data?.template && scheduleData.data?.schedule_items
				? (scheduleData.data.schedule_items as unknown as ScheduleInterface[])
				: !Array.isArray(scheduleData.data?.schedule_templates)
				? (scheduleData.data?.schedule_templates
						?.schedule_items as unknown as ScheduleInterface[])
				: undefined
		);
};

export const getSchedulesForMonth = async (
	supabase: SupabaseClient<Database>,
	month: number,
	year = new Date().getFullYear()
) => {
	return await supabase
		.from("days_schedule")
		.select(
			`
		date,
		schedule_items,
		template (
			schedule_items
		)
		`
		)
		.gte("date", `${year}-${month + 1}-01`)
		.lte(
			"date",
			`${year}-${month + 1}-${new Date(year, month + 1, 0).getDate()}`
		);
};
