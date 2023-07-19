import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const fetchGrades = async (supabase: SupabaseClient<Database>) => {
	//not sure what hide does / will do yet, but may as well fetch it anyways
	return await supabase
		.from("submissions")
		.select(
			`
        id, 
        final, 
        grade, 
        hide, 
        assignment_id (
            id,
            name,
            max_grade,
            class_id (
                id,
                name,
                color
            )
        )
        `
		)
		.neq("grade", null);
};
