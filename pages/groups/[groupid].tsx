import { NextPage } from "next";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ColoredPill } from "../../components/misc/pill";
import Image from "next/image";
import exampleGroupImg from "../../public/example-img.jpg";
import { useRouter } from "next/router";
import { getGroup, GroupResponse } from "../../lib/db/groups";
import { getDataInArray } from "../../lib/misc/dataOutArray";
import {
	Announcement,
	Member,
} from "../../components/misc/announcementsAndMembers";
import { AnnouncementPostingUI } from "../../components/complete/announcementPosting";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../lib/db/database.types";
import {
	EllipsisVerticalIcon,
	FaceSmileIcon,
} from "@heroicons/react/24/outline";

const Group: NextPage = () => {
	const router = useRouter();
	const { groupid } = router.query;
	const supabase = useSupabaseClient<Database>();
	const [groupData, setGroupData] = useState<GroupResponse>();

	useEffect(() => {
		(async () => {
			if (typeof groupid == "string") {
				const data = await getGroup(supabase, groupid);
				setGroupData(data);
			}
		})();
	}, [supabase, groupid]);

	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="relative mb-6 h-48 w-full">
				<Image
					src={groupData?.data?.image ? groupData.data.image : exampleGroupImg}
					alt="Example Image"
					className="rounded-xl object-cover object-center"
					fill
				/>
				<h1 className="title absolute  bottom-5 left-5 !text-4xl text-gray-200">
					{groupData?.data?.name}
				</h1>
			</div>
			<div className="flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List as="div" className="mx-auto mb-6 flex space-x-6">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Home
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Resources
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Members
								</div>
							)}
						</Tab>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel>
							<div className="mb-6 rounded-xl bg-gray-200 p-4">
								<p className="text-lg">{groupData?.data?.description}</p>
							</div>
							<div className="mb-3 flex items-center justify-between">
								<h2 className="title">Announcements</h2>
							</div>

							<div className="space-y-3">
								<AnnouncementPostingUI
									communityid={groupid as string}
									isClass={false}
								/>

								{groupData &&
									groupData.data &&
									groupData.data.announcements && //change below when I get actual types
									getDataInArray(groupData.data.announcements).map(
										(announcement) => (
											<Announcement
												key={announcement.id}
												announcement={announcement}
											></Announcement>
										)
									)}
							</div>
						</Tab.Panel>
						<Tab.Panel></Tab.Panel>
						<Tab.Panel>
							<div className="grid grid-cols-3 gap-4">
								{groupData &&
									groupData.data &&
									getDataInArray(groupData.data.users).map((user) => (
										<Member
											key={user!.id}
											user={user!}
											leader={
												getDataInArray(groupData.data.users_groups).find(
													(userInUsersGroups) =>
														user?.id == userInUsersGroups?.user_id
												)?.group_leader
													? true
													: false
											}
										></Member>
									))}
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
				<div className="sticky top-0 ml-8 w-[20.5rem] shrink-0 ">
					<h2 className="title">Next Event</h2>
					<Event title="Badminton" time="8:00 - 9:30 AM"></Event>
					<h2 className="title mt-6 mb-6">Upcoming</h2>
					<Event title="Badminton outside" time="12/15/22"></Event>
					<Event title="Badminton in the Pavillion" time="1/8/23"></Event>
					<Event title="Badminton in the Gym" time="12/9/24"></Event>
				</div>
			</div>
		</div>
	);
};

const Event = ({ title, time }: { title: string; time: string }) => {
	return (
		<div className="mt-6 flex items-center justify-between rounded-xl bg-gray-200 p-4">
			<p className="font-semibold">{title}</p>
			<div className="">
				<ColoredPill color={"green"}>{time}</ColoredPill>
			</div>
		</div>
	);
};

export default Group;
