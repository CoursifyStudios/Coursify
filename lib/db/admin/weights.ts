import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export const getWeights = async (
	supabase: SupabaseClient<Database>,
	school: string
) => {
	return await supabase.from("weights").select(`*`).eq("school", school);
};

export const createOrEditDefaultWeights = async (
	supabase: SupabaseClient<Database>,
	weights: { id?: string; name: string; value: number }[],
	school: string
) => {
	if (
		weights.reduce(
			(previousVal, currentVal) => previousVal + currentVal.value,
			0
		) == 100
	) {
		return await supabase.from("weights").upsert(
			weights.map((weight) => {
				if (weight.id) {
					return {
						id: weight.id,
						name: weight.name,
						value: weight.value,
						school: school,
					};
				} else {
					return { name: weight.name, value: weight.value, school: school };
				}
			})
		);
	} else {
		return "Error, weights do not sum to 100";
	}
};
