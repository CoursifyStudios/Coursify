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

		<div className="flex bg-gradient-to-br from-yellow-100 overflow-hidden to-pink-300 dark:from-transparent dark:to-transparent dark:bg-blue-950 justify-center relative">
			<div className="dark:visible invisible select-none absolute top-0 left-0">
				<Image
					src={pinkEllipse}
					alt="A Pink Ellipse"
					priority
					draggable="false"
				/>
			</div>
			<div className="dark:visible invisible absolute top-0 right-0">
				<Image
					src={blueCircle}
					alt="A Blue Circle"
					priority
					draggable="false"
				/>
			</div>
			<div className="dark:visible invisible absolute bottom-0 right-0">
				<Image
					src={orangeCircle}
					alt="A Orange Circle"
					priority
					draggable="false"
				/>
			</div>
			<div className="inset-0 absolute bg-black/10 backdrop-blur-3xl"></div>
			<div className="flex items-center h-screen flex-col justify-between py-10">
				<div className="flex flex-col space-y-3 items-center px-9">
					<h1 className=" text-4xl md:mb-48 mb-32 font-bold z-50">Welcome</h1>
					<h2 className="text-2xl font-medium z-50 text-center mb-4">
						Log into Coursify
					</h2>
					<button
						className="mb-8 flex rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium hover:bg-gray-300"
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
							className="mr-6"
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
					<button
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
					</button>
					<p className="mx-auto w-44 pt-4 text-center text-xs text-gray-600">
						By logging in, you agree to our{" "}
						<a className="text-blue-500">terms and conditions</a>
					</p>
				</div>
			</div>
		</div>
	);
}
