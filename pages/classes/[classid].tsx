import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { getClass, ClassResponse, updateClass } from "../../lib/db/classes";
import { Database, Json } from "../../lib/db/database.types";
import CircleCounter from "../../components/misc/circleCounter";
import Link from "next/link";
import { AssignmentPreview } from "../../components/complete/assignments";
import { ColoredPill } from "../../components/misc/pill";
import { PlusIcon } from "@heroicons/react/24/outline";
import Editor from "../../components/editors/richeditor";
import { EditorState } from "lexical";
import {
	getSchedule,
	ScheduleInterface,
	setThisSchedule,
} from "../../lib/db/schedule";
import { InfoPill, InfoPills } from "../../components/misc/infopills";
import { CreateAssignment } from "../../components/complete/assignmentCreation";
import { getDataInArray, getDataOutArray } from "../../lib/misc/dataOutArray";
import { Announcement } from "../../components/complete/announcements";
import { Button } from "../../components/misc/button";
import { Member } from "../../components/complete/members";
import { AnnouncementPostingUI } from "../../components/complete/announcements/announcementPosting";
import {
	AnnouncementType,
	TypeOfAnnouncements,
} from "../../lib/db/announcements";

const Class: NextPage = () => {
	const router = useRouter();
	const { classid } = router.query;
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [data, setData] = useState<ClassResponse>();
	const [grade, setGrade] = useState<number>();
	const [isTeacher, setIsTeacher] = useState<boolean>();
	const [editable, setEditable] = useState(false);
	const [editorState, setEditorState] = useState<EditorState>();
	const [edited, setEdited] = useState(false);
	const [schedule, setSchedule] = useState<ScheduleInterface[]>();
	const [scheduleT, setScheduleT] = useState<ScheduleInterface[]>();
	const [assignmentCreationOpen, setAssignmentCreationOpen] = useState(false);
	const [extraAnnouncements, setExtraAnnouncements] = useState<
		TypeOfAnnouncements[]
	>([]);
	const [fetchedClassId, setFetchedClassId] = useState("");

	const updateEditorDB = async () => {
		setEdited(true);

		const newLongDescription = editorState?.toJSON();
		if (classid != undefined && !Array.isArray(classid) && newLongDescription) {
			const data = await updateClass(supabase, classid, {
				full_description: newLongDescription as unknown as Json,
			});
		}
	};

	useEffect(() => {
		(async () => {
			if (
				user &&
				typeof classid == "string" &&
				(!data || fetchedClassId != classid)
			) {
				setData(undefined);
				setFetchedClassId(classid);
				const data = await getClass(supabase, classid);
				setData(data);
				if (data.data && Array.isArray(data.data.class_users)) {
					//grades are temporarily done like this until we figure out assignment submissions
					setGrade(
						data.data.class_users.find((v) => v.user_id == user.id)?.grade
					);
					setIsTeacher(
						data.data.class_users.find((v) => v.user_id == user.id)?.teacher
					);
				}
			}
			const allSchedules: { date: string; schedule: ScheduleInterface[] }[] =
				JSON.parse(sessionStorage.getItem("schedule")!);
			if (allSchedules && allSchedules.length != 0) {
				setSchedule(allSchedules[0].schedule);
				setScheduleT(allSchedules[1].schedule);
			} else {
				const [scheduleToday, scheduleTomorrow] = await Promise.all([
					getSchedule(supabase, new Date("2023-03-03")),
					getSchedule(supabase, new Date("2023-03-04")), //change these
				]);
				setThisSchedule(scheduleToday, setSchedule);
				setThisSchedule(scheduleTomorrow, setScheduleT);
			}
		})();
		setEdited(false);
		setEditorState(undefined);
		setEditable(false);
	}, [classid, data, supabase, user]);

	if (!data)
		return (
			<div className="mx-auto my-10 w-full max-w-screen-xl">
				<div className="relative mb-6 h-48 w-full animate-pulse rounded-xl bg-gray-200 "></div>
				<div className="flex">
					<section className="flex grow flex-col">
						<div className="flex w-full">
							<div className="mx-auto mb-7 flex space-x-6">
								<div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
								<div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
								<div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
							</div>
						</div>
						<div className="group">
							<div className="flex h-36 w-full animate-pulse rounded-xl bg-gray-200"></div>
						</div>
					</section>
					<section className="sticky top-0 ml-8 w-[20.5rem] shrink-0">
						<div>
							<h2 className="title">Grade</h2>
							<div className="mt-6 h-16 animate-pulse rounded-xl	 bg-gray-200 p-4"></div>
						</div>
						<div className="space-y-4">
							<h2 className="title mb-6 mt-4">Assignments</h2>
							<div className="flex h-20 grow animate-pulse rounded-xl bg-gray-200"></div>
							<div className="flex h-20 grow animate-pulse rounded-xl bg-gray-200"></div>
							<div className="flex h-20 grow animate-pulse rounded-xl bg-gray-200"></div>
						</div>
					</section>
				</div>
			</div>
		);

	if (!data.data && data.error) {
		return (
			<div className="mx-auto my-32 flex w-full max-w-screen-xl flex-col items-center px-4">
				<h2 className="text-3xl font-bold">
					We couldn{"'"}t find this class...
				</h2>
				<Link href="/">
					<Button color="bg-blue-500 text-white" className="mt-8">
						Back to home!
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl px-4">
			{data.data && typeof classid == "string" && (
				<CreateAssignment
					block={data.data.block}
					scheduleType={data.data.schedule_type}
					open={assignmentCreationOpen}
					setOpen={setAssignmentCreationOpen}
					classid={classid}
				/>
			)}
			<div className="relative mb-6 h-48 w-full">
				<Image
					src={data.data.image || ""}
					alt="Example Image"
					className="rounded-xl object-cover object-center"
					fill
				/>
				<ColoredPill className="absolute left-5 top-5 !bg-neutral-500/20 text-lg !text-gray-300 backdrop-blur-xl">
					Rm. {data.data.room}
				</ColoredPill>
				<div className="absolute right-5 top-5">
					<div className="flex items-center">
						<h2
							className={`text-2xl text-${data.data.color}-300 rounded-lg bg-neutral-500/20 px-2 font-bold opacity-75 backdrop-blur-xl`}
						>
							{data.data.block}
						</h2>
					</div>
				</div>

				<h1 className="title absolute bottom-5 left-5 !text-4xl text-gray-200">
					{data.data && data.data.name}
				</h1>
			</div>
			<div className="space-x sm:grid-cols-1 md:flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List
						as="div"
						className="mx-auto mb-6 flex max-sm:space-x-2 sm:space-x-6"
					>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md px-2.5 py-0.5 focus:outline-none ${
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
									className={`flex cursor-pointer items-center rounded-md px-2.5 py-0.5 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25 "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Announcements
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md px-2.5 py-0.5 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md  shadow-black/25 "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Members
								</div>
							)}
						</Tab>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel tabIndex={-1}>
							<div className="mb-3 flex flex-wrap gap-2">
								{data.data?.classpills && isTeacher != undefined && classid && (
									<InfoPills
										allPills={data.data.classpills as unknown as InfoPill[]}
										updatePills={(newPills: InfoPill[]) =>
											updateClass(
												supabase,
												Array.isArray(classid) ? classid[0] : classid,
												{ classpills: newPills as unknown as Json[] }
											)
										}
										isTeacher={isTeacher}
									/>
								)}
							</div>
							{data.data?.full_description ||
							(editorState && edited && !data.data?.full_description) ||
							editable ? (
								<div className="group relative">
									<Editor
										editable={editable}
										initialState={data.data?.full_description}
										updatedState={edited ? editorState : undefined}
										updateState={setEditorState}
										focus={true}
										//className=" "
									/>
									{isTeacher &&
										(!editable ? (
											<div
												onClick={() => setEditable(true)}
												className="brightness-hover absolute right-2 top-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold opacity-0 transition group-hover:opacity-100"
											>
												Edit
											</div>
										) : (
											<div
												onClick={() => {
													setEditable(false);
													updateEditorDB();
												}}
												className="brightness-hover absolute bottom-2 right-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold"
											>
												Save
											</div>
										))}
								</div>
							) : (
								isTeacher && (
									<div onClick={() => setEditable(true)}>
										<ColoredPill
											color="gray"
											className="mt-2 cursor-pointer"
											hoverState
										>
											Add a class description
										</ColoredPill>
									</div>
								)
							)}
						</Tab.Panel>
						<Tab.Panel tabIndex={-1} id="Announcements">
							<h2 className="title mb-3">Announcements</h2>
							<div className="space-y-3">
								{isTeacher && (
									<AnnouncementPostingUI
										announcements={extraAnnouncements}
										setAnnouncements={setExtraAnnouncements}
										communityid={classid as string}
									/>
								)}
								{extraAnnouncements.reverse().map(
									(announcement) =>
										announcement && (
											<Announcement
												key={announcement.id}
												announcement={{
													id: announcement.id,
													author: announcement.author,
													title: announcement.title,
													content: announcement.content,
													time: announcement.time,
													type: announcement.type,
													users: announcement.users,
												}}
												classID={classid as string}
												comments={
													getDataInArray(data.data.announcements).filter(
														(possibleComment) =>
															possibleComment?.type == AnnouncementType.COMMENT
													) as TypeOfAnnouncements[]
												}
												announcements={extraAnnouncements}
												setAnnouncements={setExtraAnnouncements}
											></Announcement>
										)
								)}
								{typeof classid == "string" &&
									data.data &&
									data.data.announcements && //change below when I get actual types
									getDataInArray(data.data.announcements)
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
										.map(
											(announcement) =>
												(announcement.type == AnnouncementType.ANNOUNCMENT ||
													announcement.type == AnnouncementType.CROSSPOST) &&
												announcement.users &&
												typeof getDataOutArray(announcement.users).avatar_url ==
													"string" &&
												typeof getDataOutArray(announcement.users).full_name ==
													"string" && (
													<Announcement
														key={announcement.id}
														announcement={announcement as TypeOfAnnouncements}
														classID={classid}
														comments={
															getDataInArray(data.data.announcements).filter(
																(possibleComment) =>
																	possibleComment?.type ==
																		AnnouncementType.COMMENT &&
																	getDataOutArray(possibleComment.parent)?.id ==
																		announcement.id
															) as TypeOfAnnouncements[]
														}
														announcements={extraAnnouncements}
														setAnnouncements={setExtraAnnouncements}
													></Announcement>
												)
										)}
							</div>
						</Tab.Panel>
						<Tab.Panel tabIndex={-1}>
							<div className="grid gap-4 max-sm:mx-auto max-sm:w-[20.5rem] lg:grid-cols-2 xl:grid-cols-3">
								{data.data.users ? (
									getDataInArray(data.data.users).map((user) => (
										<Member
											key={user.id}
											user={user}
											leader={
												getDataInArray(data.data.class_users).find(
													(userInUsersGroups) =>
														user?.id == userInUsersGroups?.user_id
												)?.teacher
													? true
													: false
											}
										></Member>
									))
								) : (
									<div className="rounded-xl bg-gray-200 p-4">
										An error occured
									</div>
								)}
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
				<section className="sticky top-0 mx-auto w-[20.5rem] shrink-0 sm:ml-8">
					{!isTeacher && (
						<div>
							<h2 className="title">Grade</h2>
							<div className="mt-6 rounded-xl bg-gray-200 p-4">
								<CircleCounter amount={grade} max={100} />
							</div>
						</div>
					)}
					<div className="space-y-4">
						<h2 className="title mb-6 mt-8">Assignments</h2>
						{isTeacher && (
							<div
								onClick={() => setAssignmentCreationOpen(true)}
								className="group flex h-24 grow cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black"
							>
								<PlusIcon className="-ml-4 mr-4 h-8 w-8 transition group-hover:scale-125" />{" "}
								<h3 className="text-lg font-medium transition">
									New Assignment
								</h3>
							</div>
						)}
						{data.data?.assignments &&
							user &&
							getDataInArray(data.data?.assignments).map((assignment) => (
								<div
									key={assignment.id}
									className=" brightness-hover flex rounded-xl bg-gray-200 p-3"
								>
									<AssignmentPreview
										supabase={supabase}
										assignment={
											Array.isArray(assignment) ? assignment[0] : assignment
										}
										showClassPill={false}
										starredAsParam={false}
										schedule={schedule!}
										scheduleT={scheduleT!}
										userId={user.id}
										classes={data.data}
									/>
								</div>
							))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Class;
