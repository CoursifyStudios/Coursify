import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export async function getTextbooks(supabase: SupabaseClient<Database>) {
	return await supabase.from("textbooks").select(`*`);
}

export type TypeOfFetchedTextbooks = Awaited<ReturnType<typeof getTextbooks>>;

export async function getListings(supabase: SupabaseClient<Database>) {
	return await supabase.from("listings").select(`
    *,
    users(
        id,
        full_name,
        avatar_url,
        email
    )`);
}
