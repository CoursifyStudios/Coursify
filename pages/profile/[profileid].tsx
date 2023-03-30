import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Class } from "../../components/complete/class";
import { ProfilesResponse } from "../../lib/db/profiles";
import { getProfile } from "../../lib/db/profiles";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../lib/db/database.types";
import { useRouter } from "next/router";
import { ColoredPill, CopiedHover } from "../../components/misc/pill";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { AllGroupsResponse, getAllGroupsForUser } from "../../lib/db/groups";
import { getDataInArray, getDataOutArray } from "../../lib/misc/dataOutArray";
import { GroupSmall } from "../../components/complete/group";
import { Achievement } from "../../components/complete/achievement";

export default function Profile() {
	const [profile, setProfile] = useState<ProfilesResponse>();
	const [profileClasses, setProfileClasses] =
		useState<
			PostgrestResponse<Database["public"]["Tables"]["classes"]["Row"]>
		>();
	const [profileGroups, setProfileGroups] = useState<AllGroupsResponse>();
	const supabaseClient = useSupabaseClient<Database>();
	const router = useRouter();
	const { profileid } = router.query;

	useEffect(() => {
		(async () => {
			if (profileid) {
				const profileData = await getProfile(
					supabaseClient,
					profileid as string
				);
				setProfile(profileData);
				const classesData = await supabaseClient.rpc("get_profile_classes", {
					id: profileid as string,
				});
				setProfileClasses(classesData);
				const groupsData = await getAllGroupsForUser(
					supabaseClient,
					profileid as string
				);
				setProfileGroups(groupsData);
			}
		})();
	}, [router, supabaseClient, profileid]);

	return (
		<div className="mx-auto flex w-full flex-col px-4 py-2 sm:py-4 md:px-8 md:py-8 lg:flex-row lg:space-x-8 xl:px-0 2xl:max-w-screen-xl">
			<div className="flex shrink-0 flex-col items-center md:flex-row lg:h-max lg:max-h-[calc(100vh-8rem)] lg:w-72 lg:flex-col">
				<div className="flex w-full flex-col items-center rounded-xl bg-gray-200 p-6">
					{profile && profile.data ? (
						<img
							src={profile.data.avatar_url}
							alt="Profile Picture"
							referrerPolicy="no-referrer"
							className="!ml-2 h-36 w-36 rounded-full shadow-md shadow-black/25"
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
						<div className="mt-3 mb-5 h-8 w-16 animate-pulse rounded-md bg-gray-300"></div>
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
				</div>
				{!(
					profile?.data &&
					getDataInArray(profile?.data?.users_achievements).length == 0
				) && (
					<div className="scrollbar-fancy scrollbar-fancy-darker mx-0 flex w-full flex-col items-center overflow-y-auto rounded-xl bg-gray-200 p-6 md:mx-auto  lg:mx-0 lg:mt-8 ">
						<h1 className="title mb-5">Achievements</h1>
						<div className=" grid w-full grid-cols-1 gap-6 md:grid-cols-2">
							{profile?.data?.users_achievements
								? getDataInArray(profile?.data?.users_achievements).map(
										(achievement, i) => (
											<Achievement
												data={getDataOutArray(achievement.achievements)!}
												key={i}
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

			<div className=" mx-auto mt-8 shrink-0 flex-col rounded-xl lg:mt-0 lg:h-[calc(100vh-8rem)] xl:flex">
				<h2 className="title mb-4">Classes</h2>
				<div className="scrollbar-fancy grid snap-y snap-proximity gap-8 overflow-y-auto md:grid-cols-2">
					{profileClasses && profileClasses.data
						? profileClasses.data.map((currentClass, i) => (
								<Class
									className="snap-start"
									classData={currentClass}
									key={currentClass.id}
									isLink={true}
								/>
						  ))
						: [...new Array(6)].map((_, i) => (
								<div
									key={i}
									className="h-48 w-[19rem] animate-pulse rounded-xl bg-gray-200"
								></div>
						  ))}
				</div>
			</div>
			<div className="hidden w-full flex-col rounded-xl lg:h-[calc(100vh-8rem)] xl:flex">
				<h2 className="title mb-4">Groups</h2>
				<div className="scrollbar-fancy flex snap-y snap-proximity flex-col space-y-5 overflow-y-auto">
					{profileGroups && profileGroups.data
						? profileGroups.data.map((groupLink) =>
								!Array.isArray(groupLink) && (
									<GroupSmall
										key={groupLink.group_id}
										photo={
											getDataOutArray(groupLink.groups!).image
												? getDataOutArray(groupLink.groups!).image!
												: "/example-img.jpg"
										}
										title={
											(Array.isArray(groupLink.groups)
												? groupLink.groups[0].name
												: groupLink.groups?.name) as string
										}
										id={groupLink.group_id}
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
