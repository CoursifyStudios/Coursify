import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export interface ScheduleInterface {
    timeStart: number;
    timeEnd: number;
    block: number;
}

export async function getSchedule  (
    supabaseClient: SupabaseClient<Database>,
    day: Date
) {
    return await supabaseClient //when the response comes back..
    .from("schedule")
    .select()//This should select everything, I think. It might have to be '*, $(something)', but I have no idea
    .eq("date", day.toISOString())
    .single();
}

export type ScheduleData = Awaited<ReturnType<typeof getSchedule>>;