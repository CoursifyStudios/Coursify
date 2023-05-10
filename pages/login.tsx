import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Database } from "../lib/db/database.types";
import Image from "next/image";
import { useEffect, useState } from "react";

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
	}, [user, router]);

	return (
		<div className="flex h-screen bg-teal-500 [background-image:url('/svgs/falling-triangles.svg')] dark:bg-red-300">
			<div className=" flex items-center justify-center dark:backdrop-invert md:grow">
				{/* <div className="relative rounded-xl bg-white p-4 shadow-md z-0 max-w-md">
					<p className="font-mono text-[12rem] text-gray-400 absolute -z-10 -top-14 -left-1">"</p>
					<div className="flex flex-col z-10">
						<p className="text-3xl ml-3 mt-3 font-bold ">A war is one is the sometjong something, rest of the qoute will go here ok?</p>
						<ColoredPill className="ml-auto mt-6" color="gray">Sun Tzu, The Art Of War</ColoredPill> 
					</div>
				</div> */}
			</div>
			<div className="mx-10 my-auto flex flex-grow flex-col items-center justify-center rounded-lg bg-backdrop py-20 md:mx-0 md:my-0 md:max-w-xl md:basis-1/3 md:rounded-none md:py-0">
				<h1 className="mb-14 text-3xl font-bold">Welcome Back</h1>
				<div className="flex flex-col">
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
					<button
						className="mt-8 flex rounded-md bg-gray-200 px-4 py-3 justify-center text-[1.05rem] font-medium hover:bg-gray-300"
						onClick={() =>
							supabaseClient.auth.signInWithPassword({
								email: "demo@coursify.one",
								password: "demo",
							})
						}
					>
						Demo Coursify
					</button>
					<p className="mx-auto w-44 pt-4 text-center text-xs text-gray-600">
						By logging in, you agree to our{" "}
						<a className="text-blue-500">terms and conditons</a>
					</p>
				</div>
			</div>
		</div>
	);
}
