import { BasicLayout } from "@/components/layout/layout";
import { OnboardingLayout } from "@/components/layout/onboarding";
import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { Database } from "@/lib/db/database.types";
import { ProfilesResponse, getProfile } from "@/lib/db/profiles";
import { getUserData } from "@/lib/db/settings";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

const Onboarding = () => {
	const [userData, setUserData] =
		useState<Exclude<ProfilesResponse["data"], null>>();
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const router = useRouter();
	const [contactOpen, setContactOpen] = useState(false);
	const { id } = router.query;

	useEffect(() => {
		(async () => {
			if (user && supabase && !userData) {
				const fetchedUserData = await getProfile(supabase, user.id);
				if (fetchedUserData.data) {
					setUserData(fetchedUserData.data);
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supabase, user]);

	if (!userData) {
		return (
			<>
				<h1 className=" text-4xl mb-10 font-bold z-50">Welcome</h1>
				<div className="my-auto text-lg font-medium flex flex-col items-center">
					Fetching data from your school...
					<Loading className="mt-4 bg-opacity-75 border border-gray-800/10" />
				</div>
			</>
		);
	}

	return (
		<>
			<h1 className="text-3xl md:text-4xl mb-10 font-bold truncate w-[calc(100vw-2rem)] text-center">
				Welcome, {userData.full_name.split(" ")[0]}
			</h1>
			<div className="px-4 my-auto max-w-2xl w-full ">
				<div className="bg-backdrop-200/10 backdrop-blur-3xl border border-white/10 p-8 rounded-xl shadow-xl">
					<h2 className="text-2xl mb-6 font-semibold max-w-[16rem] ">
						Let{"'"}s confirm some basic details
					</h2>
					<div className="gap-4 flex flex-col select-none cursor-not-allowed">
						<label htmlFor="" className="flex flex-col cursor-not-allowed">
							<span className="label-text">Name</span>
							<input
								type="text"
								className="grow noinputcss onboardingInput cursor-not-allowed"
								value={userData.full_name}
								disabled={true}
							/>
						</label>
						{userData.student_id && (
							<label htmlFor="" className="flex flex-col cursor-not-allowed">
								<span className="label-text">Student ID</span>
								<input
									type="text"
									className="grow noinputcss onboardingInput cursor-not-allowed"
									value={userData.student_id}
									disabled={true}
								/>
							</label>
						)}
						{userData.year && (
							<label htmlFor="" className="flex flex-col cursor-not-allowed">
								<span className="label-text">Graduation Year</span>
								<input
									type="text"
									className="grow noinputcss onboardingInput cursor-not-allowed"
									value={userData.year}
									disabled={true}
								/>
							</label>
						)}
					</div>
				</div>
				<div className="flex flex-col items-center ">
					<Button className="onboardingButton mt-8">Looks Good</Button>
					<p className="mt-1 text-sm  text-gray-600 dark:text-gray-400">or</p>
					<button
						className=" text-sm text-gray-700 font-semibold hover:underline cursor-pointer select-none"
						onClick={() => setContactOpen(true)}
					>
						Contact Admins
					</button>
					<Popup closeMenu={() => setContactOpen(false)} open={contactOpen}>
						<h3 className="title-sm mb-4">Contact</h3>
						<p>
							Please send an email to 24lseufert@shcp.edu and include
							25bholland@shcp.edu in the CC. Proceed with the setup process for
							the time being, and rest assured, we will address and resolve any
							issues on our end. Our sincere apologies for any inconvenience
							this may have caused.{" "}
						</p>
					</Popup>
				</div>
			</div>
		</>
	);
};

export default Onboarding;

Onboarding.getLayout = function getLayout(page: ReactElement) {
	return (
		<BasicLayout>
			<OnboardingLayout>{page}</OnboardingLayout>
		</BasicLayout>
	);
};
