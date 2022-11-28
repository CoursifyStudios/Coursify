import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Database } from "../lib/db/database.types";
import Image from "next/image";

export default function Login() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const router = useRouter();
	const { redirectedFrom } = router.query;

	if (user) {
		if (typeof redirectedFrom == "string")
			router.push(decodeURI(redirectedFrom));
		else router.push("/");
	}

	const url = process.env.NEXT_PUBLIC_BASE_URL
		? process.env.NEXT_PUBLIC_BASE_URL
		: "http://localhost:3000";

	return (
		<div className="flex h-screen bg-teal-500 [background-image:url('/svgs/falling-triangles.svg')]">
			<div className=" md:grow "></div>
			<div className="mx-10 my-auto flex flex-grow flex-col items-center justify-center rounded-lg bg-white py-20 md:mx-0 md:my-0 md:max-w-xl md:basis-1/3 md:rounded-none md:py-0">
				<h1 className="mb-14 text-3xl font-bold">Welcome Back</h1>
				<div className="flex flex-col">
					<button
						className="mb-8 flex rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium	hover:bg-gray-300"
						onClick={() =>
							supabaseClient.auth.signInWithOAuth({
								provider: "google",
								options: {
									redirectTo:
										typeof redirectedFrom == "string" &&
										decodeURI(redirectedFrom) != "/"
											? url + redirectedFrom
											: url,
								},
							})
						}
					>
						<Image
							src="/brand-logos/google.svg"
							alt="Google Logo"
							width={25}
							height={25}
							className="mr-4"
						/>{" "}
						Continue with Google
					</button>
					<button className="flex rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium grayscale">
						<Image
							src="/brand-logos/microsoft.svg"
							alt="Microsoft Logo"
							width={25}
							height={25}
							className="mr-4"
						/>{" "}
						Continue with Microsoft
					</button>
				</div>
			</div>
		</div>
	);
}
