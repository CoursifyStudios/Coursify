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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );
    const serversideSupabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );
    const { schoolId, studentsToEnroll }: {
      schoolId: string;
      studentsToEnroll: {
        bio?: string | null;
        created?: string;
        email: string;
        full_name: string;
        phone_number?: string | null;
        preferred_name?: string | null;
        student_id?: string | null;
        year?: string | null;
      }[];
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
        },
      );
    }
    const { data: adminStatus } = await serversideSupabaseClient.from(
      "enrolled",
    ).select("admin_bool").eq("school_id", schoolId).eq("user_id", user.id)
      .single();

    if (!adminStatus || adminStatus.admin_bool == false) {
      return new Response(JSON.stringify({ error: "You are not an admin!" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401,
      });
    }

    const newUsers = await serversideSupabaseClient.from("users").upsert([
      ...studentsToEnroll.map((student) => ({
        ...student,
        avatar_url: "",
        id: crypto.randomUUID(),
      })),
    ], {
      ignoreDuplicates: true,
    }).select("id");

    if (newUsers.error) {
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

    const newEnrollments = await serversideSupabaseClient.from("enrolled").insert([
      ...newUsers.data.map((user) => ({
        admin_bool: false,
        school_id: schoolId,
        user_id: user.id,
      })),
    ])

    return new Response("ok", {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    })

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
