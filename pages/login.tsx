import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Database } from "../lib/db/database.types";
import Link from "next/link";
import { OnboardingLayout } from "@/components/layout/onboarding";
import { BasicLayout } from "@/components/layout/layout";

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
		<>
			<h1 className="w-full  text-4xl md:mb-48 mb-32 font-bold z-50">
				Welcome
			</h1>
			<div className="w-full z-50 space-y-3">
				<h2 className="w-full text-2xl font-medium z-50 text-center pb-4">
					Log into Coursify
				</h2>
				<button
					className="w-full flex z-50 rounded-3xl w-full md:px-14 xl:px-20 [@media(min-width:2000px)]:px-28 text-lg md:py-7 px-5 py-4 items-center justify-center py-text-[1.05rem] bg-white dark:bg-black font-medium brightness-hover"
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
						className="w-full mr-4"
					/>{" "}
					Continue with Google
				</button>
				<button className="w-full flex z-50 rounded-3xl md:px-14 xl:px-20 [@media(min-width:2000px)]:px-28 text-lg md:py-7 px-5 py-4 items-center justify-center cursor-not-allowed bg-gray-200 text-[1.05rem] font-medium grayscale">
					<Image
						src="/brand-logos/microsoft.svg"
						alt="Microsoft Logo"
						width={25}
						height={25}
						className="w-full mr-4"
					/>{" "}
					Continue with Microsoft{" "}
				</button>
			</div>
		</>
	);
}

Login.getLayout = function getLayout(page: ReactElement) {
	return (
		<BasicLayout>
			<OnboardingLayout>{page}</OnboardingLayout>
		</BasicLayout>
	);
};

/*<button
	className="w-full mt-8 flex content-center rounded-md bg-gray-200 px-4 py-3 text-[1.05rem] font-medium hover:bg-gray-300"
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
		className="w-full mr-4"
	/>
	Demo Coursify LMS
</button>*/
