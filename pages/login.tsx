import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Database } from "../lib/db/database.types";

export default function Login() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const router = useRouter();
	const { redirectedFrom } = router.query;
	const [url, setUrl] = useState<string>();

	useEffect(() => {
		setUrl(window.location.origin);
		if (user && router.isReady) {
			if (typeof redirectedFrom == "string")
				router.push(decodeURI(redirectedFrom));
			else router.push("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, router]);

	return (
		<div className="flex h-screen bg-gradient-to-br from-yellow-100 to-pink-300 justify-center">
			<div className="my-auto flex flex-grow flex-col items-center justify-center rounded-lg py-20">
				<div className="flex items-center flex-col">
					<h1 className="mb-14 text-3xl font-bold dark: text-black">
						Welcome Back
					</h1>
					<button
						className="mb-8 flex rounded-md  px-4 py-3 text-[1.05rem] bg-white font-medium hover:bg-gray-300"
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
						Continue with Microsoft{" "}
					</button>
					<p className="mx-auto w-44 pt-4 text-center text-xs text-gray-600">
						By logging in, you agree to our{" "}
						<a className="text-blue-500">terms and conditions</a>
					</p>
					<h3 className="mx-auto w-44 text-center bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-3xl font-extrabold text-transparent md:ml-0">
						Coursify
					</h3>
				</div>
			</div>
		</div>
	);
}
/*<button
	className="mt-8 flex content-center rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium hover:bg-gray-300"
	onClick={() =>
		supabaseClient.auth.signInWithPassword({
			email: "demo@coursify.one",
			password: "demo",
		})
	}
	>
	<Image
		src="/brand-logos/coursify.svg"
		alt="Microsoft Logo"
		width={25}
		height={25}
		className="mr-4"
	/>
	Demo Coursify LMS
</button>*/
