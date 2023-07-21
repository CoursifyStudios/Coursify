import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { CommunityType } from "./classes";

export const fetchGrades = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	//not sure what hide does / will do yet, but may as well fetch it anyways
	return await Promise.all([
		supabase
			.from("submissions")
			//no need to fetch user_id when we have rls
			.select(
				`
        id,
        user_id, 
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
			.eq("user_id", userID) //we can get rid off this when we have functional rls
			.not("grade", "is", null)
			.limit(10),

		supabase
			.from("class_users")
			.select(
				`
            user_id,
            class_id (
                id,
                name,
                color,
                type
            ),
            grades
            `
			)
			.eq("class_id.type", CommunityType.CLASS)
			.eq("user_id", userID),
	]);
};

export type FetchedGradesType = Awaited<ReturnType<typeof fetchGrades>>;
//consolidate as rpc function later probably
//Too stupid to figure out fetching from class_users and submissions at the same time
export const fetchClassGrades = async (
	supabase: SupabaseClient<Database>,
	userID: string
) => {
	return await supabase
		.from("class_users")
		.select(
			`
            user_id,
            class_id (
                id,
                name,
                color,
                type
            ),
            grades
            `
		)
		.eq("class_id.type", CommunityType.CLASS)
		.eq("user_id", userID);
};
