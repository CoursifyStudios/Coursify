import { serve } from "https://deno.land/std@0.195.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";
import { Database } from "../_shared/database.types.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		const clientSideSupabaseClient = createClient<Database>(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
			{
				global: {
					headers: { Authorization: req.headers.get("Authorization")! },
				},
			}
		);
		const serversideSupabaseClient = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
		);
		const {
			schoolId,
			studentsToEnroll,
		}: {
			schoolId: string;
			studentsToEnroll: Omit<
				Omit<Database["public"]["Tables"]["users"]["Insert"], "avatar_url">,
				"id"
			>[];
		} = await req.json();
		const {
			data: { user },
		} = await clientSideSupabaseClient.auth.getUser();

		if (!user) {
			return new Response(
				JSON.stringify({
					error: "You must be logged in to call this function",
				}),
				{
					headers: { "Content-Type": "application/json", ...corsHeaders },
					status: 401,
				}
			);
		}
		const { data: adminStatus } = await serversideSupabaseClient
			.from("enrolled")
			.select("admin_bool")
			.eq("school_id", schoolId)
			.eq("user_id", user.id)
			.single();

		if (!adminStatus || adminStatus.admin_bool == false) {
			return new Response(JSON.stringify({ error: "You are not an admin!" }), {
				headers: { "Content-Type": "application/json", ...corsHeaders },
				status: 401,
			});
		}

		const newUsers = await serversideSupabaseClient
			.from("users")
			.upsert(
				[
					...studentsToEnroll.map((student) => ({
						...student,
						avatar_url: "",
						id: crypto.randomUUID(),
					})),
				],
				{
					ignoreDuplicates: true,
				}
			)
			.select("id");

		if (newUsers.error) {
			if (
				newUsers.error.message.includes(
					"duplicate key value violates unique constraint"
				)
			) {
				return new Response(JSON.stringify({ error: "Duplicate email" }), {
					headers: { "Content-Type": "application/json", ...corsHeaders },
					// This should be 400 but supabase function invoke doesn't return the response when it is
					status: 200,
				});
			}

			return new Response(JSON.stringify({ error: newUsers.error.message }), {
				headers: { "Content-Type": "application/json", ...corsHeaders },
				status: 500,
			});
		}

		if (newUsers.data == undefined) {
			return new Response(JSON.stringify({ error: "Internal Server Error" }), {
				headers: { "Content-Type": "application/json", ...corsHeaders },
				status: 500,
			});
		}

		const newEnrollments = await serversideSupabaseClient
			.from("enrolled")
			.insert([
				...newUsers.data.map((user) => ({
					admin_bool: false,
					school_id: schoolId,
					user_id: user.id,
				})),
			]);

		return new Response(JSON.stringify({ message: "ok" }), {
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