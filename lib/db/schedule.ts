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
	day: Date,
	template: number | null,
	scheduleDataToUse: ScheduleInterface[] | null
) => {
	if (scheduleDataToUse) {
		const time = new Date(day);
		scheduleDataToUse.map((period) => {
			time.setHours(
				parseInt(period.timeStart.substring(0, 2)),
				parseInt(period.timeStart.substring(3, 5)),
				0
			);
			
			period.timeStart = time.toTimeString();

			time.setHours(
				parseInt(period.timeEnd.substring(0, 2)),
				parseInt(period.timeEnd.substring(3, 5)),
				0
			);
			
			period.timeEnd = time.toTimeString();
		});
	}
	return await supabase.from("days_schedule").upsert({
		date: day as unknown as string, //uh not sure which format but this worked before
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
	//ik copy and paste but I just need this to work
	const time = new Date();
	scheduleDataToUse.map((period) => {
		time.setHours(
			parseInt(period.timeStart.substring(0, 2)),
			parseInt(period.timeStart.substring(3, 5)),
			0
		);
		period.timeStart = time.toTimeString();

		time.setHours(
			parseInt(period.timeEnd.substring(0, 2)),
			parseInt(period.timeEnd.substring(3, 5)),
			0
		);
		period.timeEnd = time.toTimeString();
	});
	return await supabase.from("schedule_templates").insert({
		schedule_items: JSON.parse(JSON.stringify(scheduleDataToUse)) as Json,
		name: nameToUse,
	});
};

export type NewTemplate = Awaited<ReturnType<typeof createNewTemplate>>;

export function to12hourTime(date: string): string;
export function to12hourTime(date: Date): string;

export function to12hourTime(date: unknown, includeAMPM?: boolean) {
	if (typeof date == "string") {
		if (parseInt(date.substring(0, 2)) == 12) {
			return date.substring(0, 5) + (includeAMPM ? " PM" : "");
		} else if (parseInt(date.substring(0, 2)) <= 12) {
			return (
				parseInt(date.substring(0, 2)) +
				date.substring(2, 5) +
				(includeAMPM ? " AM" : "")
			);
		} else {
			return (
				parseInt(date.substring(0, 2)) -
				12 +
				date.substring(2, 5) +
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

export function handleTimezone(time: string) {
	//potential bug creator w/ no safety checks woohoo
	//add regex check or smth here for time validation
	const local = new Date();
	local.setHours(
		parseInt(time.substring(0, 2)),
		parseInt(time.substring(3, 5)) -
			(local.getTimezoneOffset() -
				(parseInt(time.substring(13, 15)) * 60 +
					parseInt(time.substring(15, 17)))),
		0
	);
	return local.toTimeString();
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
