import { BasicLayout } from "@/components/layout/layout";
import { OnboardingLayout } from "@/components/layout/onboarding";
import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import OnboardingFirstStage from "@/components/onboarding/firstStage";
import OnboardingSecondStage from "@/components/onboarding/secondStage";
import OnboardingThirdStage from "@/components/onboarding/thirdStage";
import { AllClasses, getAllClasses } from "@/lib/db/classes";
import { Database } from "@/lib/db/database.types";
import { ProfilesResponse, getProfile } from "@/lib/db/profiles";
import { OnboardingState } from "@/middleware";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

const Onboarding = () => {
	const [userData, setUserData] =
		useState<Exclude<ProfilesResponse["data"], null>>();
	const [classes, setClasses] = useState<AllClasses>();
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const router = useRouter();
	const [contactOpen, setContactOpen] = useState(false);
	const { id } = router.query;
	const [newData, setNewData] = useState<NewUserData>({
		preferred_name: null,
		bio: null,
		phone_number: null,
		approvedPhone: false,
	});

	const setStage = (stage: OnboardingState) => {
		router.push(`/onboarding/${stage}`);
		//set cookie here
	};

	useEffect(() => {
		(async () => {
			if (user && supabase && !userData) {
				// TODO: check cookies to see if it should redirect to a specific page.

				// This is called first incase the user already started on another devide, we don't want to try and re-convert them
				const [fetchedUserData, classesData] = await Promise.all([
					await getProfile(supabase, user.id),
					await getAllClasses(supabase, user.id),
				]);
				if (fetchedUserData.data) {
					setUserData(fetchedUserData.data);
					if (classesData.data) {
						setClasses(classesData.data);
					}

					// if the onboarding cookie isn't set, go to first stage
					//setStage(OnboardingState.FirstStage);
					// if it is, go to the stage they're on
					return;
				}

				// TODO: call onboarding function here. Should probably return the same info as profiles response, or we can just call it again
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supabase, user]);

	if (!userData) {
		return (
			<>
				<h1 className="text-3xl md:text-4xl mb-10 font-bold truncate w-[calc(100vw-2rem)] text-center">
					Welcome,
				</h1>
				<div className="px-4 my-auto max-w-2xl w-full">
					<div>
						<div
							className={`bg-backdrop-200/25 overflow-hidden dark:bg-backdrop-200/10 backdrop-blur-3xl border border-white/10 p-8 rounded-xl shadow-xl transition-all duration-300 h-96`}
						></div>
						<div className="flex flex-col items-center">
							<>
								<Button
									className="onboardingButton mt-8"
								>
									Looks Good
								</Button>
								<p className="mt-1 text-sm  text-gray-600 dark:text-gray-400">
									or
								</p>
								<button
									className=" text-sm text-gray-700 font-semibold hover:underline cursor-pointer select-none"
								>
									Contact Admins
								</button>
							</>
						</div>
					</div>
				</div>
			</>
		);
	}

	if (userData && !classes) {
		return <div>We couldn{"'"}t find your classes...</div>;
	}

	return (
		<>
			<h1 className="text-3xl md:text-4xl mb-10 font-bold truncate w-[calc(100vw-2rem)] text-center">
				Welcome, {userData.full_name.split(" ")[0]}
			</h1>
			<div className="px-4 my-auto max-w-2xl w-full">
				<>
					<div
						className={`bg-backdrop-200/25 overflow-hidden dark:bg-backdrop-200/10 backdrop-blur-3xl border border-white/10 p-8 rounded-xl shadow-xl transition-all duration-300 scaley ${
							id == OnboardingState.FirstStage && (userData.student_id ? userData.year ? "h-96" : "h-[18.5rem]" : userData.year ? "h-[18.5rem]" : "h-56" )
						} 
						${
							id == OnboardingState.SecondStage &&
							(newData.phone_number ? "h-[26.5rem] " : "h-96")
						}
							`}
						style={
							id == OnboardingState.ThirdStage && classes
								? {
										height: `${
											classes.filter((c) => Boolean(c.class)).length * 6 + 6
										}rem`,
										WebkitTransform: `translate3d(0, 0, 0)`,
										msTransform: `translate3d(0, 0, 0)`,
										transform: `translate3d(0, 0, 0)`,
								  }
								: undefined
						}
					>
						<OnboardingFirstStage
							id={id as OnboardingState}
							userData={userData}
						/>
						<OnboardingSecondStage
							id={id as OnboardingState}
							userData={userData}
							newData={newData}
							setNewData={setNewData}
						/>
						<OnboardingThirdStage
							id={id as OnboardingState}
							classes={classes}
						/>
					</div>
					<div className="flex flex-col items-center ">
						{id == OnboardingState.FirstStage && (
							<>
								<Button
									className="onboardingButton mt-8"
									onClick={() => setStage(OnboardingState.SecondStage)}
								>
									Looks Good
								</Button>
								<p className="mt-1 text-sm  text-gray-600 dark:text-gray-400">
									or
								</p>
								<button
									className=" text-sm text-gray-700 font-semibold hover:underline cursor-pointer select-none"
									onClick={() => setContactOpen(true)}
								>
									Contact Admins
								</button>
							</>
						)}
						{id == OnboardingState.SecondStage && (
							<>
								<div className="flex gap-6">
									<Button
										className="secondaryOnboardingButton mt-8"
										onClick={() => setStage(OnboardingState.FirstStage)}
									>
										Back
									</Button>
									<Button
										className="onboardingButton mt-8"
										onClick={() => setStage(OnboardingState.ThirdStage)}
									>
										Next
									</Button>
								</div>
								<div className="invisible">
									<p className="mt-1 text-sm  text-gray-600 dark:text-gray-400">
										or
									</p>
									<button
										className=" text-sm text-gray-700 font-semibold hover:underline cursor-pointer select-none"
										onClick={() => setContactOpen(true)}
									>
										Contact Admins
									</button>
								</div>
							</>
						)}
						{id == OnboardingState.ThirdStage && (
							<>
								<div className="flex gap-6">
									<Button
										className="secondaryOnboardingButton mt-8"
										onClick={() => setStage(OnboardingState.SecondStage)}
									>
										Back
									</Button>
									<Button className="onboardingButton mt-8">Finish</Button>
								</div>
								<div className="invisible">
									<p className="mt-1 text-sm  text-gray-600 dark:text-gray-400">
										or
									</p>
									<button
										className=" text-sm text-gray-700 font-semibold hover:underline cursor-pointer select-none"
										onClick={() => setContactOpen(true)}
									>
										Contact Admins
									</button>
								</div>
							</>
						)}
						<Popup closeMenu={() => setContactOpen(false)} open={contactOpen}>
							<h3 className="title-sm mb-4">Contact</h3>
							<p>
								Please send an email to 24lseufert@shcp.edu and include
								25bholland@shcp.edu in the CC. Proceed with the setup process
								for the time being, and rest assured, we will address and
								resolve any issues on our end. Our sincere apologies for any
								inconvenience this may have caused.{" "}
							</p>
						</Popup>
					</div>
				</>
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
