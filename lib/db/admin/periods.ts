import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export const getPeriods = async (
	supabase: SupabaseClient<Database>,
	school: string
) => {
	return await supabase
		.from("grading_periods")
		.select(`*`)
		.eq("school", school);
};

export const editGradingPeriods = async (
	supabase: SupabaseClient<Database>,
	periods: {
		end_date: string;
		id?: string;
		name: string;
		parent?: string | null;
		school: string;
		start_date: string;
		weight: number;
	}[]
) => {
	return await supabase.from("grading_periods").upsert(periods).select();
};
