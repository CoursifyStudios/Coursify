import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { Class } from "../../components/complete/class";
import { ProfilesResponse } from "../../lib/db/profiles";
import { getProfile } from "../../lib/db/profiles";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../lib/db/database.types";
import { useRouter } from "next/router";
import { ColoredPill, CopiedHover } from "../../components/misc/pill";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { AllGroupsResponse, getAllGroups } from "../../lib/db/groups";
import { group } from "console";

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
				const groupsData = await getAllGroups(
					supabaseClient,
					profileid as string
				);

				console.log(groupsData);
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
								<p className="invisible">
									{":"}trojker{":"}
								</p>
								<div className="absolute inset-0 animate-pulse rounded-md bg-gray-300"></div>
							</>
						)}
					</h1>
					<h2 className="mb-4 text-xl">2023</h2>

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
				<div className="scrollbar-fancy scrollbar-fancy-darker mx-0 flex flex-col items-center overflow-y-auto rounded-xl bg-gray-200 p-6 md:mx-auto  lg:mx-0 lg:mt-8 ">
					<h1 className="title mb-5">Achievements</h1>
					<div className=" grid grid-cols-1 gap-6 md:grid-cols-2">
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="Inquiry and Innovation program"
							title="i2"
						/>
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="The good test takers"
							title="DePaul"
						/>
					</div>
				</div>
			</div>

			<div className=" scrollbar-fancy mx-auto mt-8 shrink-0 overflow-y-auto  rounded-xl lg:mt-0 lg:h-[calc(100vh-8rem)]">
				<h2 className="title mb-4">Classes</h2>
				<div className="grid gap-8 md:grid-cols-2">
					{profileClasses && profileClasses.data
						? profileClasses.data.map((currentClass, i) => (
								<Class classData={currentClass} key={i} isLink={true} />
						  ))
						: ""}
				</div>
			</div>
			<div className="scrollbar-fancy hidden w-full flex-col overflow-y-auto rounded-xl lg:h-[calc(100vh-8rem)] xl:flex">
				<h2 className="title mb-4">Groups</h2>
				<div className="flex flex-col gap-8">
					{profileGroups &&
						profileGroups.data &&
						profileGroups.data &&
						profileGroups.data.map((groupLink) =>
							Array.isArray(groupLink) ? (
								groupLink.map((group) => (
									<Groups
										key={group.id}
										photo="/profileexample.jpg"
										title={group.name ? group.name : ""}
										description={group.description ? group.description : ""}
									/>
								))
							) : (
								<Groups
                                    key={groupLink.group_id}
									photo="/profileexample.jpg"
									title={
										(Array.isArray(groupLink.groups)
											? groupLink.groups[0].name
											: groupLink.groups?.name) as string
									}
									description={
										(Array.isArray(groupLink.groups)
											? groupLink.groups[0].description
											: groupLink.groups?.description) as string
									}
								/>
							)
						)}
				</div>
			</div>
		</div>
	);
}

const Achievement = ({
	icon,
	title,
	description,
}: {
	icon: ReactNode;
	title: string;
	description: string;
}) => {
	return (
		<div className="flex flex-col text-center">
			<div className="mx-auto rounded-full bg-white p-4">{icon}</div>
			<h3 className="mt-2 font-bold line-clamp-2 ">{title}</h3>
			<h4 className="text-sm line-clamp-2">{description}</h4>
		</div>
	);
};

const Groups = (props: {
	photo: string;
	title: string;
	description: string;
}) => {
	return (
		<div className="flex w-full items-center rounded-md bg-gray-200 p-4 transition duration-300 hover:shadow-lg hover:brightness-95 ">
			<Image
				width={100}
				height={100}
				className="mr-2 h-10 w-10 rounded-full object-cover"
				alt={"Groups image for " + props.title}
				src={props.photo}
			/>
			<div className="flex flex-col justify-center">
				<h3 className="text-l w-28 font-bold line-clamp-2 ">{props.title}</h3>
			</div>
		</div>
	);
};
