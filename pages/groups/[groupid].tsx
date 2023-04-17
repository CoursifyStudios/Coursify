import { NextPage } from "next";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ColoredPill } from "../../components/misc/pill";
import Image from "next/image";
import exampleGroupImg from "../../public/example-img.jpg";
import { useRouter } from "next/router";
import { getGroup, GroupResponse } from "../../lib/db/groups";
import { getDataInArray } from "../../lib/misc/dataOutArray";
import { Member } from "../../components/complete/members";
import {
	Announcement,
	AnnouncementPostingUI,
} from "../../components/complete/announcements";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../lib/db/database.types";

const Group: NextPage = () => {
	const router = useRouter();
	const { groupid } = router.query;
	const supabase = useSupabaseClient<Database>();
	const [groupData, setGroupData] = useState<GroupResponse>();
	const [refreshAnnouncements, setRefreshAnnouncements] = useState(false);

	useEffect(() => {
		(async () => {
			if (typeof groupid == "string") {
				const data = await getGroup(supabase, groupid);
				setGroupData(data);
			}
		})();
	}, [supabase, groupid]);

	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl px-4">
			<div className="relative mb-6 h-48 w-full">
				{groupData?.data?.image ? (
					<Image
						src={groupData.data.image}
						alt="Example Image"
						className="rounded-xl object-cover object-center"
						fill
					/>
				) : (
					<div className="absolute inset-0 animate-pulse bg-gray-200" />
				)}
				<h1 className="title absolute bottom-5 left-5 z-10 !text-4xl text-gray-200">
					{groupData?.data?.name}
				</h1>
			</div>
			<div className="sm:grid-cols-1 md:flex ">
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
						<Tab.Panel tabIndex={-1} className="mb-10">
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
									prevRefreshState={refreshAnnouncements}
									refreshAnnouncements={setRefreshAnnouncements}
								/>

								{groupData &&
									groupData.data &&
									groupData.data.announcements && //change below when I get actual types
									getDataInArray(groupData.data.announcements)
										.sort((a, b) => {
											if (
												new Date(a.time!).getTime() >
												new Date(b.time!).getTime()
											)
												return -1;
											if (
												new Date(a.time!).getTime() <
												new Date(b.time!).getTime()
											)
												return 1;
											return 0;
										})
										.map((announcement) => (
											<Announcement
												key={announcement.id}
												announcement={announcement}
											></Announcement>
										))}
							</div>
						</Tab.Panel>
						<Tab.Panel tabIndex={-1}></Tab.Panel>
						<Tab.Panel tabIndex={-1}>
							<div className="grid grid-cols-3 gap-4">
								{groupData &&
									groupData.data &&
									getDataInArray(groupData.data.users).map((user) => (
										<Member
											key={user!.id}
											user={user!}
											leader={
												getDataInArray(groupData.data.group_users).find(
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
				<div className="sticky top-0 mx-auto w-[20.5rem] shrink-0 rounded-md blur-sm sm:ml-8 ">
					<h2 className="title">Next Event</h2>
					<Event title="Castle Rock" time="8:00 - 9:30 AM"></Event>
					<h2 className="title mt-6 mb-6">Upcoming</h2>
					<Event title="Yosemite Climbing" time="12/15/22"></Event>
					<Event title="Mission Cliffs" time="1/8/23"></Event>
					<Event title="Boulder Sesh" time="12/9/24"></Event>
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
