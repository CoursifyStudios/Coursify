import { BasicLayout } from "@/components/layout/layout";
import { OnboardingLayout } from "@/components/layout/onboarding";
import { Button } from "@/components/misc/button";
import Loading, { LoadingSmall } from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import OnboardingFirstStage from "@/components/onboarding/firstStage";
import OnboardingSecondStage from "@/components/onboarding/secondStage";
import OnboardingThirdStage from "@/components/onboarding/thirdStage";
import { AllClasses, getAllClasses } from "@/lib/db/classes";
import { Database } from "@/lib/db/database.types";
import { ProfilesResponse, getProfile } from "@/lib/db/profiles";
import { updateBio, updateProfile } from "@/lib/db/settings";
import { OnboardingState } from "@/middleware";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const initialNewData = {
	preferred_name: null,
	bio: null,
	phone_number: null,
	approvedPhone: false,
};

const Onboarding = () => {
	const [userData, setUserData] =
		useState<Exclude<ProfilesResponse["data"], null>>();
	const [classes, setClasses] = useState<AllClasses>();
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const router = useRouter();
	const [contactOpen, setContactOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [bsLoading, setBSloading] = useState(false);
	const { id } = router.query;
	const [newData, setNewData] = useState<NewUserData>(initialNewData);
	const [error, setError] = useState("");
	const [cookies, setCookie, removeCookie] = useCookies(["onboardingState"]);

	const setStage = (stage: OnboardingState) => {
		setError("");
		router.push(`/onboarding/${stage}`);
		setBSloading(false);
		setCookie("onboardingState", stage);
	};

	const finish = async () => {
		const { error } = await supabase
			.from("users")
			.update({ onboarded: true })
			.eq("id", user ? user.id : "");
		setBSloading(true);
		setCookie("onboardingState", OnboardingState.Done);

		setTimeout(() => {
			router.push("/");
		}, 4000);
	};

	const saveNewData = async () => {
		setError("");

		if (!newData.approvedPhone && newData.phone_number) {
			setError("You need to accept the terms to add a phone number");
			return;
		}

		if (
			newData.phone_number &&
			// if the phone number isn't 10 or 11 digits
			!(newData.phone_number.length == 10 || newData.phone_number.length == 11)
		) {
			setError("Your phone number is incomplete! (shortcodes are not allowed)");
			return;
		}
		setLoading(true);
		const { approvedPhone: _, ...data }: NewUserData = newData;
		const phone = newData.phone_number
			? newData.phone_number.length == 10
				? "1" + newData.phone_number
				: newData.phone_number
			: null;
		const toInsert = {
			...data,
			phone_number: phone,
		};
		if (
			userData &&
			JSON.stringify(toInsert) !=
				JSON.stringify({
					bio: userData.bio,
					phone_number: userData.phone_number,
					preferred_name: userData.preferred_name,
				})
		) {
			const { error } = await updateProfile(supabase, user?.id ?? "", {
				...data,
				phone_number: phone,
			});
			if (error) {
				setError(error.message);
				return;
			}
		}

		setLoading(false);

		setStage(OnboardingState.ThirdStage);
	};

	useEffect(() => {
		(async () => {
			if (user && supabase && !userData) {
				// check cookies to see if it should redirect to a specific page. Probably worth using middleware too -LS

				if (cookies.onboardingState == OnboardingState.Done) {
					router.push("/");
				}
				if (cookies.onboardingState == OnboardingState.NoAccount) {
					setStage(OnboardingState.NoAccount);
				}

				// This is called first incase the user already started on another screen, we don't want to try and re-convert them -LS

				const [fetchedUserData, classesData] = await Promise.all([
					await getProfile(supabase, user.id),
					await getAllClasses(supabase, user.id),
				]);

				if (fetchedUserData.data) {
					const user = fetchedUserData.data;
					setUserData(fetchedUserData.data);
					setNewData({
						approvedPhone: Boolean(user.phone_number),
						bio: user.bio,
						phone_number: user.phone_number,
						preferred_name: user.preferred_name,
					});
					if (classesData.data) {
						setClasses(classesData.data);
					}

					if (cookies.onboardingState) {
						// if the onboarding cookie isn't set, go to first stage
						setStage(OnboardingState.FirstStage);
						// if it is, go to the stage they're on
						setStage(cookies.onboardingState);
					}

					return;
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supabase, user]);

	if (!userData) {
		if (!user) {
			return null;
		}
		return (
			<>
				<h1 className="text-3xl md:text-4xl mb-10 font-bold truncate w-[calc(100vw-2rem)] text-center">
					Welcome, {user.user_metadata.full_name.split(" ")[0]}
				</h1>
				<div className="px-4 my-auto max-w-2xl w-full">
					<div className="bg-backdrop-200/25 overflow-hidden dark:bg-backdrop-200/10 backdrop-blur-3xl border border-white/10 opacity-0 rounded-xl shadow-xl transition-all duration-300 "></div>
					<div className="flex flex-col items-center opacity-0 transition duration-300">
						<Button
							className="onboardingButton mt-8"
							onClick={() => setStage(OnboardingState.SecondStage)}
						>
							Looks Good
						</Button>
						<p className="mt-1 text-sm  text-gray-600 dark:text-gray-400">or</p>
						<button
							className=" text-sm text-gray-700 font-semibold hover:underline cursor-pointer select-none"
							onClick={() => setContactOpen(true)}
						>
							Contact Admins
						</button>
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
						className={`bg-backdrop-200/25 overflow-hidden dark:bg-backdrop-200/10 backdrop-blur-3xl border border-white/10 p-8 opacity-100 rounded-xl shadow-xl transition-all duration-300 ${
							id == OnboardingState.FirstStage &&
							(userData.student_id
								? userData.year
									? "h-96"
									: "h-[18.5rem]"
								: userData.year
								? "h-[18.5rem]"
								: "h-56")
						} 
						${
							id == OnboardingState.SecondStage &&
							(newData.phone_number ? "h-[26.5rem] " : "h-96")
						}
						${id == OnboardingState.ThirdStage && bsLoading && "h-48"}
							`}
						style={
							id == OnboardingState.ThirdStage && classes && !bsLoading
								? {
										height: `${
											classes.filter((c) => Boolean(c.class)).length * 6 + 6.5
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
							bsLoading={bsLoading}
						/>
					</div>
					<div className="flex flex-col items-center opacity-100 transition duration-300">
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
										onClick={saveNewData}
									>
										Next {loading && <LoadingSmall className="ml-2" />}
									</Button>
								</div>
								{/* TThis is a really stupid hack to prevent wierd cls transitions */}
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
									<Button className="onboardingButton mt-8" onClick={finish}>
										Finish
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
						<Popup closeMenu={() => setContactOpen(false)} open={contactOpen}>
							<h3 className="title-sm mb-4">Contact</h3>
							<p>
								Please send us an email at <Link href="mailto:support@coursify.freshdesk.com" target="_blank">
								support@coursify.freshdesk.com
								</Link>. Proceed with the setup process
								for the time being, and rest assured, we will address and
								resolve any issues on our end. Our sincere apologies for any
								inconvenience this may have caused.{" "}
							</p>
						</Popup>
						{error && (
							<div className="text-red-500 text-sm">Error: {error}</div>
						)}
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
