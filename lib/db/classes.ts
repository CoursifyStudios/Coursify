import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSchedulesForXDays, ScheduleInterface } from "./schedule";
import { getDataOutArray } from "../misc/dataOutArray";

export async function getAllClasses(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from("classes")
		.select(
			`
	id,
    name,
    description,
    block,
    schedule_type,
    color,
    name_full,
    room,
    full_description,
    classpills,
    image,
    type,
	users (
		avatar_url, id, full_name
	),
	class_users (
		user_id, teacher, grade
	),
    assignments (
        *,
        starred (
            *
        )
    )
	`
		)
		.eq("type", 0);
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
}

export type AllClassesResponse = Awaited<ReturnType<typeof getAllClasses>>;

export const getClass = async (
	supabase: SupabaseClient<Database>,
	classid: string
) => {
	return await supabase
		.from("classes")
		.select(
			`
            id,
            name,
            description,
            block,
            schedule_type,
            color,
            name_full,
            room,
            full_description,
            classpills,
            image,
        announcements (
            *,
            users (
                *
            )
        ),
		assignments (
			name, description, id, due_type, due_date
		),
		class_users (
			user_id, grade, teacher
		),
		users (
			*
		)
	`
		)
		.eq("id", classid)
		.limit(5, { foreignTable: "assignments" })
		.order("due_date", { foreignTable: "assignments", ascending: true })
		.single();
};

export type ClassResponse = Awaited<ReturnType<typeof getClass>>;

export interface IndividialClass {
	data: Database["public"]["Tables"]["classes"]["Row"];
}

export const getUserSchool = async (supabase: SupabaseClient<Database>) => {
	return await supabase.from("schools").select(
		`
		name,
		users (
			username
		)
		`
	);
	// .eq("id", "1e5024f5-d493-4e32-9822-87f080ad5516")
	// .single();
};

export type UserSchoolResponse = Awaited<ReturnType<typeof getClass>>;

export const updateClass = async (
	supabase: SupabaseClient<Database>,
	classid: string,
	updates: Database["public"]["Tables"]["classes"]["Update"]
) => {
	return await supabase.from("classes").update(updates).eq("id", classid);
};

export enum CommunityType {
	CLASS = 0,
	GROUP = 1,
	//add stuff here for sports group, or maybe even stuff such as invite only groups
}
export const getClassTimesForXDays = async (
	supabase: SupabaseClient<Database>,
	classObject: {
		block: number;
		type: number;
	},
	startDate: Date,
	duration: number
) => {
	const monthSchedules = await getSchedulesForXDays(
		supabase,
		startDate,
		duration
	);
	const dates: { startTime: Date; endTime: Date }[] = [];
	if (monthSchedules.data) {
		monthSchedules.data.map((daySchedule) => {
			const dateStart = new Date(daySchedule.date);
			const dateEnd = new Date(daySchedule.date);
			if (
				daySchedule.schedule_templates &&
				getDataOutArray(daySchedule.schedule_templates).schedule_items &&
				classHappensThisDay(
					classObject.block,
					classObject.type,
					getDataOutArray(daySchedule.schedule_templates)
						.schedule_items as unknown as ScheduleInterface[]
				) != undefined
			) {
				const temp = classHappensThisDay(
					classObject.block,
					classObject.type,
					getDataOutArray(daySchedule.schedule_templates)
						.schedule_items as unknown as ScheduleInterface[]
				);
				dateStart.setHours(parseInt(temp!.timeStart.substring(0, 2)));
				dateStart.setMinutes(parseInt(temp!.timeStart.substring(3)));
				dateEnd.setHours(parseInt(temp!.timeEnd.substring(0, 2)));
				dateEnd.setMinutes(parseInt(temp!.timeEnd.substring(3)));

				dates.push({
					startTime: dateStart,
					endTime: dateEnd,
				});
			}
			if (
				daySchedule.schedule_items &&
				!daySchedule.schedule_templates &&
				classHappensThisDay(
					classObject.block,
					classObject.type,
					getDataOutArray(
						daySchedule.schedule_items
					) as unknown as ScheduleInterface[]
				) != undefined
			) {
				const temp = classHappensThisDay(
					classObject.block,
					classObject.type,
					getDataOutArray(
						daySchedule.schedule_items
					) as unknown as ScheduleInterface[]
				);
				dateStart.setHours(parseInt(temp!.timeStart.substring(0, 2)));
				dateStart.setMinutes(parseInt(temp!.timeStart.substring(3)));
				dateEnd.setHours(parseInt(temp!.timeEnd.substring(0, 2)));
				dateEnd.setMinutes(parseInt(temp!.timeEnd.substring(3)));

				dates.push({
					startTime: dateStart,
					endTime: dateEnd,
				});
			}
		});
	}
	return sortDatesAscending(dates);
};

function sortDatesAscending(
	dates: { startTime: Date; endTime: Date }[]
): { startTime: Date; endTime: Date }[] {
	return dates.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

function classHappensThisDay(
	block: number,
	type: number,
	schedule: ScheduleInterface[]
) {
	return schedule.find(
		(period) => period.block == block && period.type == type
	);
}
export const getClassesForUserBasic = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	return await supabase
		.from("class_users")
		.select(
			`
    teacher,
    classes (
        id,
        name,
        type
    )`
		)
		.eq("user_id", userID);
};

export type BasicClassInfoDB = Awaited<
	ReturnType<typeof getClassesForUserBasic>
>;

