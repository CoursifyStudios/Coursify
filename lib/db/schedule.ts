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
	supabase: SupabaseClient<Database>,
	day: Date
) {
	return await supabase //when the response comes back..
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
export async function getScheduleTemplates(supabase: SupabaseClient<Database>) {
	return await supabase.from("schedule_templates").select(`*`);
}

export type ScheduleTemplatesDB = Awaited<
	ReturnType<typeof getScheduleTemplates>
>;

export const createNewSchedule = async (
	supabase: SupabaseClient<Database>,
	day: unknown,
	template: number | null,
	scheduleDataToUse: ScheduleInterface[] | null
) => {
	return await supabase.from("days_schedule").insert({
		date: day as string,
		template: template,
		schedule_items: scheduleDataToUse
			? (JSON.parse(JSON.stringify(scheduleDataToUse)) as Json)
			: null,
	});
};

export type NewSchedule = Awaited<ReturnType<typeof createNewSchedule>>;

export const createNewTemplate = async (
	supabase: SupabaseClient<Database>,
	nameToUse: string,
	scheduleDataToUse: ScheduleInterface[]
) => {
	return await supabase.from("schedule_templates").insert({
		schedule_items: JSON.parse(JSON.stringify(scheduleDataToUse)) as Json,
		name: nameToUse,
	});
};

export type NewTemplate = Awaited<ReturnType<typeof createNewTemplate>>;

export function to12hourTime(date: string, includeAMPM?: boolean): string;
export function to12hourTime(date: Date, includeAMPM?: boolean): string;

export function to12hourTime(date: unknown, includeAMPM?: boolean) {
	if (typeof date == "string") {
		if (parseInt(date.substring(0, 2)) == 12) {
			return date + (includeAMPM ? " PM" : "");
		} else if (parseInt(date.substring(0, 2)) <= 12) {
			return (
				parseInt(date.substring(0, 2)) +
				date.substring(2) +
				(includeAMPM ? " AM" : "")
			);
		} else {
			return (
				parseInt(date.substring(0, 2)) -
				12 +
				date.substring(2) +
				(includeAMPM ? " PM" : "")
			);
		}
	} else {
		let hour = (date as Date).getHours();
		const minute = (date as Date).getMinutes().toString().padStart(2, "0");
		const AMPM = hour >= 12 ? "PM" : "AM";
		hour = hour % 12 || 12;

		return `${hour}:${minute}${includeAMPM ? ` ${AMPM}` : ""}`;
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

export const getSchedulesForXDays = async (
	supabase: SupabaseClient<Database>,
	startDate: Date,
	numDays: number
) => {
	const endDate = new Date(startDate.getTime());
	endDate.setDate(startDate.getDate() + numDays);
	return await supabase
		.from("days_schedule")
		.select(
			`
		date,
		schedule_items,
		schedule_templates (
			*
		)
		`
		)
		.gte("date", startDate.toISOString().slice(0, 10))
		.lte("date", endDate.toISOString().slice(0, 10));
};

export type ManySchedules = Awaited<ReturnType<typeof getSchedulesForXDays>>;
