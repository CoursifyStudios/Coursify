import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { getClass, ClassResponse, updateClass } from "../../lib/db/classes";
import { Database, Json } from "../../lib/db/database.types";
import exampleClassImg from "../../public/example-img.jpg";
import CircleCounter from "../../components/misc/circleCounter";
import Link from "next/link";
import { AssignmentPreview } from "../../components/complete/assignments";
import { ColoredPill, CopiedHover } from "../../components/misc/pill";
import {
	IdentificationIcon,
	EnvelopeIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { useTabs } from "../../lib/tabs/handleTabs";
import Editor from "../../components/editors/richeditor";
import { EditorState } from "lexical";
import {
	getSchedule,
	ScheduleInterface,
	setThisSchedule,
} from "../../lib/db/schedule";
import { InfoPill, InfoPills } from "../../components/misc/infopills";
import { CreateAssignment } from "../../components/complete/assignmentCreation";
import { getDataInArray } from "../../lib/misc/dataOutArray";
import {
	Announcement,
	AnnouncementPostingUI,
} from "../../components/complete/announcements";

const Class: NextPage = () => {
	const router = useRouter();
	const { classid } = router.query;
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [data, setData] = useState<ClassResponse>();
	const [grade, setGrade] = useState<number>();
	const [isTeacher, setIsTeacher] = useState<boolean>();
	const { newTab } = useTabs();
	const [editable, setEditable] = useState(false);
	const [editorState, setEditorState] = useState<EditorState>();
	const [edited, setEdited] = useState(false);
	const [schedule, setSchedule] = useState<ScheduleInterface[]>();
	const [scheduleT, setScheduleT] = useState<ScheduleInterface[]>();
	const [assignmentCreationOpen, setAssignmentCreationOpen] = useState(false);
	const [refreshAnnouncements, setRefreshAnnouncements] = useState(false);

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
			if (user && typeof classid == "string") {
				setData(undefined);
				const data = await getClass(supabase, classid);
				setData(data);
				if (data.data && Array.isArray(data.data.users_classes)) {
					//grades are temporarily done like this until we figure out assignment submissions
					setGrade(
						data.data.users_classes.find((v) => v.user_id == user.id)?.grade
					);
					setIsTeacher(
						data.data.users_classes.find((v) => v.user_id == user.id)?.teacher
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
					getSchedule(supabase, new Date("2023-03-04")),
				]);
				setThisSchedule(scheduleToday, setSchedule);
				setThisSchedule(scheduleTomorrow, setScheduleT);
			}
		})();
		setEdited(false);
		setEditorState(undefined);
	}, [user, supabase, classid, refreshAnnouncements]);

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
							<h2 className="title mt-4 mb-6">Assignments</h2>
							<div className="flex h-20 grow animate-pulse rounded-xl bg-gray-200"></div>
							<div className="flex h-20 grow animate-pulse rounded-xl bg-gray-200"></div>
							<div className="flex h-20 grow animate-pulse rounded-xl bg-gray-200"></div>
						</div>
					</section>
				</div>
			</div>
		);

	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<CreateAssignment
				open={assignmentCreationOpen}
				setOpen={setAssignmentCreationOpen}
			/>
			<div className="relative mb-6 h-48 w-full">
				<Image
					src={data.data?.image ? data.data.image : exampleClassImg}
					alt="Example Image"
					className="rounded-xl object-cover object-center"
					fill
				/>
				<h1 className="title absolute bottom-5 left-5 !text-4xl text-gray-200">
					{data.data && data.data.name}
				</h1>
			</div>
			<div className="flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List as="div" className="mx-auto mb-6 flex space-x-6">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${
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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${
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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${
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
						<Tab.Panel>
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
												className="brightness-hover absolute right-2 bottom-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold"
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
						<Tab.Panel>
							<h2 className="title mb-3">Announcements</h2>
							<div className="space-y-3">
								<AnnouncementPostingUI
									communityid={classid as string}
									isClass={true}
									prevRefreshState={refreshAnnouncements}
									refreshAnnouncements={setRefreshAnnouncements}
								/>

								{data.data &&
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
										.map((announcement) => (
											<Announcement
												key={announcement.id}
												announcement={announcement}
											></Announcement>
										))}
							</div>
						</Tab.Panel>
						<Tab.Panel>
							<div className="grid grid-cols-3 gap-4">
								{data.data?.users && Array.isArray(data.data?.users) ? (
									data.data?.users.map((user, i) => (
										<Link
											className="brightness-hover flex rounded-xl bg-gray-200 p-6"
											key={i}
											href={"/profile/" + user.id}
											onClick={() =>
												newTab(
													"/profile/" + user.id,
													user.full_name.split(" ")[0] + "'s Profile"
												)
											}
										>
											<div className="relative h-max">
												<img
													src={user.avatar_url!}
													alt="Profile picture"
													referrerPolicy="no-referrer"
													className=" h-10 min-w-[2.5rem] rounded-full shadow-md shadow-black/25"
												/>
												{data.data.users_classes &&
													Array.isArray(data.data.users_classes) && // based on my testing it will always return an array, doing this to make ts happy
													data.data.users_classes.find(
														(userValue) =>
															userValue.teacher && user.id == userValue.user_id
													) && (
														<div className="absolute -bottom-1 -right-1  flex rounded-full bg-yellow-100 p-0.5">
															<IdentificationIcon className="h-4 w-4 text-yellow-600" />
														</div>
													)}
											</div>
											<div className="ml-4 flex flex-col">
												<h2 className="mb-1 font-medium">{user.full_name}</h2>
												<CopiedHover copy={user.email ?? "No email found"}>
													<ColoredPill color="gray">
														<div className="flex items-center">
															<EnvelopeIcon className="mr-1.5 h-4 w-4 text-gray-800" />
															{user.email &&
																user.email.slice(0, 15) +
																	(user.email?.length > 15 ? "..." : "")}
														</div>
													</ColoredPill>
												</CopiedHover>
											</div>
										</Link>
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
				<section className="sticky top-0 ml-8 w-[20.5rem] shrink-0">
					{!isTeacher && (
						<div>
							<h2 className="title">Grade</h2>
							<div className="mt-6 rounded-xl bg-gray-200 p-4">
								<CircleCounter amount={grade} max={100} />
							</div>
						</div>
					)}
					<div className="space-y-4">
						<h2 className="title mt-8 mb-6">Assignments</h2>
						{isTeacher && (
							<div
								onClick={() => setAssignmentCreationOpen(true)}
								className="group flex h-24 grow cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black"
							>
								<PlusIcon className="mr-4 -ml-4 h-8 w-8 transition group-hover:scale-125" />{" "}
								<h3 className="text-lg font-medium transition">
									New Assignment
								</h3>
							</div>
						)}
						{Array.isArray(data.data?.assignments) &&
							user &&
							data.data?.assignments.map((assignment) => (
								<div // no longer needs to be a lonk
									key={assignment.id}
									className=" brightness-hover flex rounded-xl bg-gray-200 p-3"
									//href={"/assignments/" + assignment.id}
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
