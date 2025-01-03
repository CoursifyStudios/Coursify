/* eslint-disable no-console */
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

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

		const registeredUsers = await serversideSupabaseClient
			.from("users")
			.select("id,email")
			.in(
				"email",
				studentsToEnroll.map((user) => user.email)
			);

		if (registeredUsers.error) {
			console.log(registeredUsers.error);
			return new Response(
				JSON.stringify({ error: "Internal Server Error: Fetching" }),
				{
					headers: { "Content-Type": "application/json", ...corsHeaders },
					status: 500,
				}
			);
		}

		const newUsers = await serversideSupabaseClient
			.from("users")
			.insert([
				...studentsToEnroll
					.filter(
						(s) =>
							registeredUsers.data.find((u) => u.email === s.email) == undefined
					)
					.map((u) => ({
						...u,
						avatar_url: "",
						id: crypto.randomUUID(),
					})),
			])
			.select("id");

		if (newUsers.error) {
			console.log(newUsers.error);
			return new Response(
				JSON.stringify({ error: "Internal Server Error: Creation" }),
				{
					headers: { "Content-Type": "application/json", ...corsHeaders },
					status: 500,
				}
			);
		}

		const alreadyEnrolled = await serversideSupabaseClient
			.from("enrolled")
			.select("user_id")
			.eq("school_id", schoolId)
			.in(
				"user_id",
				[...registeredUsers.data, ...newUsers.data].map((user) => user.id)
			);

		if (alreadyEnrolled.error) {
			console.log(alreadyEnrolled.error)
			return new Response(
				JSON.stringify({ error: "Internal Server Error: Adding" }),
				{
					headers: { "Content-Type": "application/json", ...corsHeaders },
					status: 500,
				}
			);
		}

		const toEnroll = [...registeredUsers.data, ...newUsers.data]
			.filter(
				(user) =>
					alreadyEnrolled.data.find((u) => u.user_id == user.id) == undefined
			)
			.map((user) => ({
				admin_bool: false,
				school_id: schoolId,
				user_id: user.id,
			}));

		if (toEnroll.length > 0) {
			const newEnrollments = await serversideSupabaseClient
				.from("enrolled")
				.insert([
					...[...registeredUsers.data, ...newUsers.data]
						.filter(
							(user) =>
								alreadyEnrolled.data.find((u) => u.user_id == user.id) ==
								undefined
						)
						.map((user) => ({
							admin_bool: false,
							school_id: schoolId,
							user_id: user.id,
						})),
				]);

			if (newEnrollments.error) {
				console.log(newEnrollments.error)
				return new Response(
					JSON.stringify({
						error: "Internal Server Error: Enrolling"
					}),
					{
						headers: { "Content-Type": "application/json", ...corsHeaders },
						status: 500,
					}
				);
			}
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
