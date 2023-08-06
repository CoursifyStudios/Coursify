import { BasicLayout } from "@/components/layout/layout";
import { OnboardingLayout } from "@/components/layout/onboarding";
import { Button } from "@/components/misc/button";
import Loading from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import OnboardingFirstStage from "@/components/onboarding/firstStage";
import { Database } from "@/lib/db/database.types";
import { ProfilesResponse, getProfile } from "@/lib/db/profiles";
import { getUserData } from "@/lib/db/settings";
import { OnboardingState } from "@/middleware";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import notFound from "@/public/svgs/not-found.svg";
import Link from "next/link";

const Onboarding = () => {
	const user = useUser();
	const [contactOpen, setContactOpen] = useState(false);

	return (
		<>
			<h1 className="text-3xl md:text-4xl mb-10 font-bold truncate w-[calc(100vw-2rem)] text-center">
				Welcome{user && `, ${user.user_metadata.full_name.split(" ")[0]}`}
			</h1>
			<div className="px-4 my-auto max-w-2xl w-full">
				<div
					className={`bg-backdrop-200/25 items-center flex flex-col dark:bg-backdrop-200/10 backdrop-blur-3xl border border-white/10 p-8 rounded-xl shadow-xl transition-all duration-300`}
				>
					<div className="text-2xl mb-6 text-center font-semibold">
						Coursify can{"'"}t find your account
					</div>
					<Image
						src={notFound}
						alt="Not Found"
						className="h-56 w-56 translate-x-4"
						draggable={false}
					/>
					<p className="text-center text-sm mx-8 mt-6">
						Students: It{"'"}s likely that your administrator hasn{"'"}t added
						your account to Coursify yet. Contact your school for help getting
						access.
					</p>
					<p
						className="text-center  font-semibold text-sm mt-6 hover:underline select-none cursor-pointer"
						onClick={() => setContactOpen(true)}
					>
						I want to create a new school
						<Popup closeMenu={() => setContactOpen(false)} open={contactOpen}>
							<h3 className="title-sm mb-4">Contact</h3>
							<p>
								Coursify LMS is currently in a closed beta. If you{"'"}re an
								administrator interested in using Coursify, please reach out to
								our growth team at{" "}
								<Link href="mailto:growth@coursify.studio" target="_blank">
									growth@coursify.studio
								</Link>
								. If you would like demo the platform,{" "}
								<Link href={"/demo"} className="text-blue-500">
									click here
								</Link>
								.
							</p>
						</Popup>
					</p>
				</div>
				{/* <div className="flex flex-col items-center ">
					<Button className="onboardingButton mt-8">I{"'"}m a parent</Button>
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
				</div> */}
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
