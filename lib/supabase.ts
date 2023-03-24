import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types";
import type { GetResult } from "@supabase/postgrest-js/dist/module/select-query-parser";

export default createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
