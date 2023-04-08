import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { NonNullableArray } from "../misc/misc.types";
import type { Database } from "./database.types";
import { getSchedulesForXDays, ScheduleInterface } from "./schedule";
import { getDataOutArray } from "../misc/dataOutArray";

export async function getAllClasses(supabaseClient: SupabaseClient<Database>) {
	const { data, error } = await supabaseClient.from("classes").select(`
	*,
	users (
		avatar_url, id, full_name
	),
	users_classes (
		user_id, teacher, grade
	),
    assignments (
        *,
        starred (
            *
        )
    )
	`);
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
	supabaseClient: SupabaseClient<Database>,
	classid: string
) => {
	return await supabaseClient
		.from("classes")
		.select(
			`
		*,
        announcements (
            *,
            users (
                *
            )
        ),
		assignments (
			name, description, id, due_type, due_date
		),
		users_classes (
			user_id, grade, teacher
		),
		users (
			*
		)
	`
		)
		.eq("id", classid)
		.single();
};

export type ClassResponse = Awaited<ReturnType<typeof getClass>>;

export interface IndividialClass {
	data: Database["public"]["Tables"]["classes"]["Row"];
}

export const getUserSchool = async (
	supabaseClient: SupabaseClient<Database>
) => {
	return await supabaseClient.from("schools").select(
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
	const dates: Date[] = [];
	if (monthSchedules.data) {
		monthSchedules.data.map((daySchedule) => {
			if (
				daySchedule.template &&
				getDataOutArray(daySchedule.template).schedule_items &&
				classHappensThisDay(
					classObject.block,
					classObject.type,
					getDataOutArray(daySchedule.template)
						.schedule_items as unknown as ScheduleInterface[]
				)
			) {
				const date = new Date(daySchedule.date);
				dates.push(date);
			}
			if (
				daySchedule.schedule_items &&
				!daySchedule.template &&
				classHappensThisDay(
					classObject.block,
					classObject.type,
					getDataOutArray(
						daySchedule.schedule_items
					) as unknown as ScheduleInterface[]
				)
			) {
				const date = new Date(daySchedule.date);
				dates.push(date);
			}
		});
	}
	return sortDatesAscending(dates);
};

function sortDatesAscending(dates: Date[]): Date[] {
	return dates.sort((a, b) => a.getTime() - b.getTime());
}

function classHappensThisDay(
	block: number,
	type: number,
	schedule: ScheduleInterface[]
) {
	return (
		schedule.find((period) => period.block == block && period.type == type) !=
		undefined
	);
}
