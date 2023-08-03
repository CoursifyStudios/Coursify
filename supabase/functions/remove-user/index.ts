// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
/* eslint-disable no-console */

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
		const serversideSupabaseClient = createClient<Database>(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
		);
		const {
			schoolId,
			studentsToRemove,
		}: {
			schoolId: string;
			studentsToRemove: string[];
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

		const deletedEnrollments = await clientSideSupabaseClient
			.from("enrolled")
			.delete()
			.or(studentsToRemove.map((s) => `user_id.eq.${s}`).join(","))
			.select("*");

		if (deletedEnrollments.error || deletedEnrollments.data == undefined) {
			console.log(deletedEnrollments.error, deletedEnrollments.data);
			return new Response(
				JSON.stringify({ error: "Unknown error while removing" }),
				{
					headers: { "Content-Type": "application/json", ...corsHeaders },
					status: 200,
				}
			);
		}

		const deletedClassRelations = await clientSideSupabaseClient
			.from("class_users")
			.delete()
			.or(studentsToRemove.map((s) => `user_id.eq.${s}`).join(","))
			.select("*");

		if (
			deletedClassRelations.error ||
			deletedClassRelations.data == undefined
		) {
			console.log(deletedClassRelations.error, deletedClassRelations.data);
			return new Response(
				JSON.stringify({ error: "Unknown error while unenrolling" }),
				{
					headers: { "Content-Type": "application/json", ...corsHeaders },
					status: 200,
				}
			);
		}

		const assignmentIds = await serversideSupabaseClient
			.from("assignments")
			.select("id")
			.or(
				deletedClassRelations.data
					.map((c) => `class_id.eq.${c.class_id}`)
					.join(",")
			);

		const achievementIds = await serversideSupabaseClient
			.from("achievements")
			.select("id")
			.eq("school", schoolId);

		// No point returning an error if no submissions were deleted
		if (assignmentIds.error == undefined && assignmentIds.data != undefined) {
			await serversideSupabaseClient
				.from("submissions")
				.delete()
				.or(
					`and(assignment_id.in.(${assignmentIds.data
						.map((a) => a.id)
						.join(",")}),user_id.in.(${studentsToRemove.join(",")}))`
				);
		}

		// No point returning an error if no achievements were found
		if (achievementIds.error == undefined && achievementIds.data != undefined) {
			await serversideSupabaseClient
				.from("user_achievements")
				.delete()
				.or(
					`and(achievement_id.in.(${achievementIds.data
						.map((a) => a.id)
						.join(",")}),user_id.in.(${studentsToRemove.join(",")}))`
				);
		}

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

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

// supabase functions deploy
