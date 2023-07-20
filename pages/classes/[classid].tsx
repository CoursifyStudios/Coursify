import { AnnouncementsComponent } from "@/components/complete/announcements/announcementsComponent";
import { Member } from "@/components/complete/members";
import CircleCounter from "@/components/counters/circle";
import Editor from "@/components/editors/richeditor";
import { Button } from "@/components/misc/button";
import { InfoPill, InfoPills } from "@/components/misc/infopills";
import { ColoredPill } from "@/components/misc/pill";
import { TypeOfAnnouncements } from "@/lib/db/announcements";
import { ClassResponse, getClass, updateClass } from "@/lib/db/classes";
import { Database, Json } from "@/lib/db/database.types";
import {
	ScheduleInterface,
	getSchedule,
	setThisSchedule,
} from "@/lib/db/schedule";
import { getDataInArray } from "@/lib/misc/dataOutArray";
import { useSettings } from "@/lib/stores/settings";
import { CreateAssignment } from "@assignments/assignmentCreation";
import { AssignmentPreview } from "@assignments/assignments";
import { Tab } from "@headlessui/react";
import {
	EnvelopeIcon,
	EnvelopeOpenIcon,
	MagnifyingGlassIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { EditorState } from "lexical";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

const Class: NextPage = () => {
	const router = useRouter();
	const { classid } = router.query;
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [data, setData] = useState<ClassResponse>();
	const [grade, setGrade] = useState<number | null>();
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
	const [searchOpen, setSearchOpen] = useState(false);

	const {
		data: { compact },
	} = useSettings();

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
	}, [classid, data, supabase, user, fetchedClassId]);

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
		<div className="mx-auto my-10 flex w-full max-w-screen-xl flex-col px-4">
			{data.data && typeof classid == "string" && (
				<CreateAssignment
					block={data.data.block}
					scheduleType={data.data.schedule_type}
					open={assignmentCreationOpen}
					setOpen={setAssignmentCreationOpen}
					classid={classid}
				/>
			)}
			{!compact ? (
				<div className="relative mb-6 h-48 w-full">
					<Image
						src={data.data.image || ""}
						alt="Example Image"
						className="rounded-xl object-cover object-center"
						fill
					/>
					<ColoredPill className="absolute left-5 top-5 !bg-neutral-500/20 text-lg !text-gray-300 backdrop-blur-xl dark:!text-gray-100">
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

					<h1 className="title absolute bottom-5 left-5 !text-4xl text-gray-200 dark:text-gray-100">
						{data.data && data.data.name}
					</h1>
				</div>
			) : (
				<div className="mx-auto mb-10 flex flex-col items-center">
					<h1 className="title text-white-200 mb-3 !text-4xl">
						{data.data && data.data.name}
					</h1>
					<div className="flex gap-4">
						<ColoredPill color="gray">Rm. {data.data.room}</ColoredPill>
						<ColoredPill color="gray">Block {data.data.block}</ColoredPill>
					</div>
				</div>
			)}
			<div className="space-x sm:grid-cols-1 md:flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List
						as="div"
						className="mx-auto mb-6 flex max-sm:space-x-2 sm:space-x-6"
					>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-lg border px-2.5 py-0.5 focus:outline-none ${
										selected
											? "brightness-focus"
											: "border-transparent bg-gray-200"
									} text-lg font-semibold`}
								>
									Home
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-lg border px-2.5 py-0.5 focus:outline-none ${
										selected
											? "brightness-focus"
											: "border-transparent bg-gray-200"
									} text-lg font-semibold `}
								>
									Announcements
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-lg border px-2.5 py-0.5 focus:outline-none ${
										selected
											? "brightness-focus"
											: "border-transparent bg-gray-200"
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
								{classid && typeof classid == "string" && (
									<div className="space-y-4">
										<AnnouncementsComponent
											fetchedAnnouncements={
												getDataInArray(
													data.data.announcements
												) as unknown as TypeOfAnnouncements[]
											}
											communityid={classid}
											showPostingUI={isTeacher ? true : false}
										></AnnouncementsComponent>
									</div>
								)}
							</div>
						</Tab.Panel>
						<Tab.Panel tabIndex={-1}>
							<div className="mb-4 flex justify-between">
								<div
									className={`${
										searchOpen ? "max-w-[24rem]" : "max-w-[14rem]"
									} relative flex grow items-center pr-2 transition-all`}
								>
									<input
										type="text"
										className="grow !rounded-xl py-0.5 placeholder:dark:text-gray-400"
										onClick={() => setSearchOpen(true)}
										onBlur={() => setSearchOpen(false)}
										placeholder="Search users..."
									/>
									<MagnifyingGlassIcon className="absolute right-3 h-4 w-4" />
								</div>
								{isTeacher && data.data.users && (
									<div className="flex gap-2">
										<span
											onClick={() =>
												navigator.clipboard.writeText(
													getDataInArray(data.data.users)
														.map((v) => v.email)
														.join(",")
												)
											}
										>
											<ColoredPill
												className="brightness-hover grid h-full cursor-pointer place-items-center !rounded-lg !bg-backdrop-200"
												hoverState
											>
												Copy All Emails
											</ColoredPill>
										</span>
										<a
											href={`mailto:${getDataInArray(data.data.users)
												.map((v) => v.email)
												.join(",")}`}
											rel="noopener norefferer"
											target="_blank"
											className="brightness-hover group grid cursor-pointer place-items-center rounded-lg bg-backdrop-200 px-1.5"
										>
											<EnvelopeIcon className="h-5 w-5 group-hover:hidden" />
											<EnvelopeOpenIcon className="-mt-1 hidden h-5 w-5 group-hover:block" />
										</a>
									</div>
								)}
							</div>

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
										An error occurred
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
								className="group flex h-24 grow cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
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
								<AssignmentPreview
									key={assignment.id}
									className="brightness-hover"
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
							))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Class;
