import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Database } from "../lib/database.types";

export default function Login() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const router = useRouter();

	if (user) router.push("/");

	return (
		<div>
			<button
				className="mt-4 rounded-md bg-gray-200 px-4 py-2 font-medium"
				onClick={() =>
					supabaseClient.auth.signInWithOAuth({
						provider: "google",
						options: {
							redirectTo: "/",
						},
					})
				}
			>
				login
			</button>
		</div>
	);
}
