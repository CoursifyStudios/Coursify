import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Class } from "../../components/class";
import { Achievement } from "../../components/complete/achievement";
import { GroupSmall } from "../../components/complete/group";
import { ColoredPill, CopiedHover } from "../../components/misc/pill";
import { CommunityType } from "../../lib/db/classes";
import { Database } from "../../lib/db/database.types";
import { ProfilesResponse, getProfile } from "../../lib/db/profiles";
import { getDataInArray, getDataOutArray } from "../../lib/misc/dataOutArray";
import { useSettings } from "../../lib/stores/settings";

export default function Profile() {
	const [profile, setProfile] = useState<ProfilesResponse>();
	const [communities, setCommunities] =
		useState<
			PostgrestResponse<Database["public"]["Tables"]["classes"]["Row"]>
		>();
	//const [profileGroups, setProfileGroups] = useState<AllGroupsResponse>();
	const supabase = useSupabaseClient<Database>();
	const router = useRouter();
	const { profileid } = router.query;
	const { data: settings } = useSettings();

	useEffect(() => {
		(async () => {
			if (profileid) {
				const profileData = await getProfile(supabase, profileid as string);
				setProfile(profileData);
				const communitiesData = await supabase.rpc("get_profile_classes", {
					id: profileid as string,
				});
				setCommunities(communitiesData);
			}
		})();
	}, [router, supabase, profileid]);

	return (
		<div className="mx-auto flex w-full flex-col px-4 py-2 sm:py-4 md:px-8 md:py-8 lg:flex-row lg:space-x-8 xl:px-0 2xl:max-w-screen-xl">
			{/* Left sidebar, main info */}
			<div className="flex shrink-0 flex-col items-center md:flex-row lg:h-max lg:max-h-[calc(100vh-8rem)] lg:w-72 lg:flex-col">
				<div className="flex w-full flex-col items-center rounded-xl bg-backdrop-200 p-6">
					{profile && profile.data ? (
						<Image
							src={profile.data.avatar_url}
							alt="Profile Picture"
							//referrerPolicy="no-referrer"
							className="!ml-2 h-36 w-36 rounded-full shadow-md shadow-black/25"
							width={144}
							height={144}
						/>
					) : (
						<div className="!ml-2 h-36 w-36 animate-pulse rounded-full bg-gray-300"></div>
					)}
					<h1 className="relative mt-5 break-words text-center text-3xl font-bold">
						{profile?.data ? (
							profile.data.full_name
						) : (
							<>
								<p className="invisible">Rick Astley</p>
								<div className="absolute inset-0 animate-pulse rounded-md bg-gray-300 "></div>
							</>
						)}
					</h1>
					{profile && profile.data ? (
						<h2 className="mb-4 text-xl">{profile?.data?.year}</h2>
					) : (
						<div className="mb-5 mt-3 h-8 w-16 animate-pulse rounded-md bg-gray-300"></div>
					)}

					<CopiedHover copy={profile?.data?.email || "No email found"}>
						<ColoredPill color="gray">
							<div className="flex items-center">
								<EnvelopeIcon className="mr-1.5 h-4 w-4 text-gray-800" />
								{profile && profile.data && profile.data.email
									? profile.data.email.slice(0, 26) +
									  (profile.data.email.length > 26 ? "..." : "")
									: "No email found"}
							</div>
						</ColoredPill>
					</CopiedHover>
					<p className="mt-3 text-center text-sm">{profile?.data?.bio}</p>
				</div>
				{!(
					profile?.data &&
					getDataInArray(profile?.data?.user_achievements).length == 0
				) && (
					<div className="scrollbar-fancy scrollbar-fancy-darker mx-0 flex w-full flex-col items-center overflow-y-auto rounded-xl bg-backdrop-200 p-6 md:mx-auto lg:mx-0 lg:mt-8 ">
						<h1 className="title mb-5">Achievements</h1>
						<div className=" grid w-full grid-cols-1 gap-6 md:grid-cols-2">
							{profile?.data?.user_achievements
								? getDataInArray(profile?.data?.user_achievements).map(
										(achievement) => (
											<Achievement
												data={getDataOutArray(achievement.achievements)!}
												key={achievement.achivement_id}
												earned={new Date(achievement.date_earned)}
											/>
										)
								  )
								: [...new Array(4)].map((_, i) => (
										<div
											className="flex cursor-pointer select-none flex-col items-center rounded-xl"
											key={i}
										>
											<div className="relative h-16 w-16 animate-pulse rounded-full bg-gray-300"></div>
											<div className="mb-2 mt-3 h-6 w-16 animate-pulse rounded bg-gray-300"></div>
										</div>
								  ))}
						</div>
					</div>
				)}
			</div>
			{/* Centerpeice, list of classes */}
			<div className=" mx-auto mt-8 shrink-0 flex-col rounded-xl lg:mt-0 lg:h-[calc(100vh-8rem)] xl:flex">
				<h2 className="title mb-4">Classes</h2>
				<div
					className={`scrollbar-fancy grid snap-y snap-proximity gap-8 ${
						communities && communities.data
							? "overflow-y-auto"
							: "overflow-hidden"
					}  md:grid-cols-2 `}
				>
					{communities && communities.data
						? communities.data.map(
								(currentClass) =>
									currentClass.type == CommunityType.CLASS && (
										<Class
											className="snap-start"
											classData={currentClass}
											key={currentClass.id}
											isLink={true}
										/>
									)
						  )
						: [...new Array(6)].map((_, i) => (
								<div
									key={i}
									className="h-48 w-[19rem] animate-pulse rounded-xl bg-gray-200"
								></div>
						  ))}
				</div>
			</div>
			{/* Right sidepanel, list of groups */}
			<div className="hidden w-full flex-col rounded-xl lg:h-[calc(100vh-8rem)] xl:flex">
				<h2 className="title mb-4">Groups</h2>
				<div className="scrollbar-fancy flex snap-y snap-proximity flex-col space-y-5 overflow-y-auto">
					{communities && communities.data
						? communities.data.map(
								(group) =>
									//Could have used greater than or equal to, but let's not shoot our future selves in the foot - Bill
									//well at this point
									group.type >= CommunityType.SCHOOLWIDE_GROUP && (
										<GroupSmall
											key={group.id}
											photo={group.image}
											title={group.name}
											id={group.id}
											isLink={true}
										/>
									)
						  )
						: [...new Array(4)].map((_, i) => (
								<div
									key={i}
									className="h-24 w-[16rem] animate-pulse rounded-xl bg-gray-200"
								></div>
						  ))}
				</div>
			</div>
		</div>
	);
}
