import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const createOrEditDefaultWeights = async (
	supabase: SupabaseClient<Database>,
	weights: { name: string; value: number }[],
	school: string
) => {
	if (
		weights.reduce(
			(previousVal, currentVal) => previousVal + currentVal.value,
			0
		) == 100
	) {
		return await supabase.from("weights").insert(
			weights.map((weight) => {
				return { name: weight.name, weight: weight.value, school: school };
			})
		);
	} else {
		return "Error, weights do not sum to 100";
	}
};

export const createOrEditGradingPeriods = async (
	supabase: SupabaseClient<Database>,
	periods: { name: string; value: number }[],
	school: string
) => {
	if (
		periods.reduce(
			(previousVal, currentVal) => previousVal + currentVal.value,
			0
		) == 100
	) {
		// return await supabase.from("grading_periods").insert(
		// 	periods.map((period) => {
		// 		return { name: period.name, weight: period.value, school: school };
		// 	})
		// );
	} else {
		return "Error, weights do not sum to 100";
	}
};
