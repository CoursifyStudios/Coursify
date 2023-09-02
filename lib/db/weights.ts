import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const createOrEditDefaultWeights = async (
	supabase: SupabaseClient<Database>,
	weights: { name: string; weight: number }[],
	school: string
) => {
	if (
		weights.reduce(
			(previousVal, currentVal) => previousVal + currentVal.weight,
			0
		) == 100
	) {
		return await supabase.from("weights").insert(
			weights.map((weight) => {
				return { name: weight.name, weight: weight.weight, school: school };
			})
		);
	} else {
		return "Error, weights do not sum to 100";
	}
};
