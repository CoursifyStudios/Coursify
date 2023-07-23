import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Database } from "../lib/db/database.types";
import pinkEllipse from "@/public/svgs/pinkEllipse.svg";
import blueCircle from "@/public/svgs/blueCircle.svg";
import orangeCircle from "@/public/svgs/orangeCircle.svg";
import Link from "next/link";

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
		<div className="flex bg-gradient-to-br from-yellow-100 to-pink-300 dark:from-transparent dark:to-transparent dark:bg-blue-950 justify-center relative">
			<div className="dark:visible invisible select-none absolute top-0 left-0">
				<Image src={pinkEllipse} alt="A Pink Ellipse" draggable="false" />
			</div>
			<div className="dark:visible invisible absolute top-0 right-0">
				<Image src={blueCircle} alt="A Blue Circle" draggable="false" />
			</div>
			<div className="dark:visible invisible absolute bottom-0 right-0">
				<Image src={orangeCircle} alt="A Orange Circle" draggable="false" />
			</div>
			<div className="flex items-center h-screen flex-col justify-between py-10">
				<div className="flex flex-col space-y-3 items-center px-9">
					<h1 className=" text-4xl mb-48 font-bold z-50">Welcome</h1>
					<h2 className="text-2xl font-medium z-50 text-center mb-4">
						Log into Coursify
					</h2>
					<button
						className="flex z-50 rounded-3xl w-full md:px-28 text-lg md:py-7 px-5 py-4 items-center justify-center py-text-[1.05rem] bg-white dark:bg-black font-medium brightness-hover"
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
					<button className="flex z-50 rounded-3xl md:px-28 text-lg md:py-7 px-5 py-4 items-center justify-center cursor-not-allowed bg-gray-200 text-[1.05rem] font-medium grayscale">
						<Image
							src="/brand-logos/microsoft.svg"
							alt="Microsoft Logo"
							width={25}
							height={25}
							className="mr-4"
						/>{" "}
						Continue with Microsoft{" "}
					</button>
				</div>
				<h3 className="text-center z-50 bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-3xl font-extrabold text-transparent md:ml-0">
					Coursify
				</h3>
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
