import { serve } from "https://deno.land/std@0.195.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";
import { Database } from "../_shared/database.types.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
    

		const serversideSupabaseClient = createClient<Database>(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
		);

	const { path }: { path: string[]} = await req.json();

    await serversideSupabaseClient.storage.from("ugc").remove(path)
		return new Response(JSON.stringify({ message: "ok"}), {
			headers: { "Content-Type": "application/json", ...corsHeaders },
			status: 200,
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { "Content-Type": "application/json", ...corsHeaders },
			status: 400,
		});
	}
});
