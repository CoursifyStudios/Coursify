import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	ChevronLeftIcon,
	LinkIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
	AllAssignmentResponse,
	AssignmentResponse,
	getAllAssignments,
	getAssignment,
} from "../../lib/db/assignments";
import { Database } from "../../lib/db/database.types";
import launch from "../../public/svgs/launch.svg";
import noData from "../../public/svgs/no-data.svg";
import Link from "next/link";
import { ColoredPill, CopiedHover } from "../../components/misc/pill";
import { ButtonIcon } from "../../components/misc/button";
import { AssignmentPreview } from "../../components/complete/assignments";
import {
	getSchedule,
	ScheduleInterface,
	setThisSchedule,
} from "../../lib/db/schedule";
import Editor from "../../components/editors/richeditor";
import { Transition, Dialog } from "@headlessui/react";
import { getIcon } from "../../components/complete/achievement";
import { formatDate } from "../../lib/misc/formatDate";

const Post: NextPage = () => {
	const supabase = useSupabaseClient<Database>();
	const [allAssignments, setAllAssignments] = useState<AllAssignmentResponse>();
	const [assignment, setAssignment] = useState<AssignmentResponse>();
	//obviously we need a better solution
	const [schedule, setSchedule] = useState<ScheduleInterface[]>();
	const [scheduleT, setScheduleT] = useState<ScheduleInterface[]>();
	const router = useRouter();
	const user = useUser();
	const { assignmentid } = router.query;
	const [fullscreen, setFullscreen] = useState(false);

	useEffect(() => {
		(async () => {
			if (user) {
				const assignments = await getAllAssignments(supabase);
				setAllAssignments(assignments);
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

		(async () => {
			if (
				user &&
				router.isReady &&
				typeof assignmentid == "string" &&
				assignmentid != "0"
			) {
				setAssignment(undefined);
				const assignment = await getAssignment(supabase, assignmentid);
				setAssignment(assignment);
			}
		})();
		if (router.isReady && assignmentid != "0" && window.innerWidth < 768) {
			setFullscreen(true);
		}
	}, [user, supabase, router, assignmentid]);

	return (
		<div className="mx-auto flex w-full max-w-screen-xl px-4 pt-6 pb-6 md:px-8 xl:px-0">
			<div
				className={`scrollbar-fancy mr-4 grow items-stretch overflow-x-clip md:grow-0 ${
					fullscreen ? "hidden" : "flex"
				} w-[20.5rem] shrink-0 snap-y snap-mandatory flex-col space-y-5 overflow-y-auto pb-6 md:h-[calc(100vh-6.5rem)] `}
			>
				{allAssignments ? (
					!allAssignments.error &&
					user &&
					schedule &&
					allAssignments.data.map((assignment) => (
						<Link
							className={`flex snap-start rounded-xl ${
								assignmentid == assignment.id
									? "bg-gray-50 shadow-xl"
									: "brightness-hover bg-gray-200"
							} p-3`}
							href={"/assignments/" + assignment.id}
							key={assignment.id}
						>
							<AssignmentPreview
								supabase={supabase} //@ts-ignore
								assignment={assignment}
								userId={user.id}
								starredAsParam={
									assignment.starred
										? Array.isArray(assignment.starred)
											? assignment.starred.length > 0
											: !!assignment.starred
										: false
								}
								//obviously we need a better solution
								schedule={schedule!}
								scheduleT={scheduleT!}
								showClassPill={true}
								//@ts-ignore
								classes={
									(assignment.classes_assignments &&
									Array.isArray(assignment.classes_assignments)
										? Array.isArray(assignment.classes_assignments[0].classes)
											? assignment.classes_assignments[0].classes[0]
											: assignment.classes_assignments[0].classes
										: assignment.classes_assignments)!
								}
							/>
						</Link>
					))
				) : (
					<>
						{[...Array(3)].map((_, i) => (
							<div
								className="h-24 animate-pulse rounded-xl bg-gray-200 "
								key={i}
							></div>
						))}
					</>
				)}
			</div>
			<div
				className={`grow rounded-xl px-4 md:h-[calc(100vh-6.5rem)] ${
					fullscreen ? "flex" : "hidden md:flex"
				}`}
			>
				<AssignmentPane />
			</div>
		</div>
	);

	function AssignmentPane() {
		const [isOpen, setIsOpen] = useState(false);
		if (
			!router.isReady ||
			!allAssignments ||
			(!assignment && assignmentid != "0")
		) {
			return (
				<div className=" flex grow flex-col">
					<ColoredPill color="gray" className="mr-auto animate-pulse">
						<span className="invisible">trojker</span>
					</ColoredPill>
					<div className="mt-4 w-full max-w-lg rounded-xl bg-gray-200 p-4 xl:max-w-xl">
						<h1 className="title mb-2 w-max rounded-md bg-gray-300 line-clamp-2">
							<span className="invisible">trojker anem name ass</span>
						</h1>
						<p className="mt-4 w-max rounded-md bg-gray-300 line-clamp-2">
							<span className="invisible">
								trojker longer description would go hereeeeeeeee coolio
							</span>
						</p>
					</div>
					<div className="mt-6 flex grow">
						<div className="mt-4 w-full max-w-lg rounded-xl bg-gray-200 p-4 xl:max-w-xl"></div>
						<div className="mt-4 ml-4 max-h-48 grow rounded-xl bg-gray-200 p-4 xl:max-w-xl"></div>
					</div>
				</div>
			);
		}

		if (assignmentid == "0") {
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src={launch}
						alt="Nothing present icon"
						width={150}
						height={150}
					/>
					<h1 className=" mt-4 max-w-xs text-center font-semibold">
						Click an assignment on the left pane to get started
					</h1>
				</div>
			);
		}

		if (assignment?.error) {
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src={noData}
						alt="Nothing present icon"
						width={150}
						height={150}
					/>
					<h1 className=" mt-4 max-w-xs text-center font-semibold">
						This assignment doesn{"'"}t exist (or you don{"'"}t have access to
						it)
					</h1>
				</div>
			);
		}

		if (assignment?.data) {
			return (
				<>
					<div className="flex grow flex-col">
						<section className="flex items-start justify-between">
							<div className="mr-4 grow lg:max-w-lg xl:max-w-xl">
								<Link
									className=" md:hidden"
									href="/assignments/0"
									onClick={() => setFullscreen(false)}
								>
									<ButtonIcon
										icon={<ChevronLeftIcon className="h-5 w-5" />}
										className="mb-4"
									/>
								</Link>
								<Link
									href={
										"/classes/" +
										(Array.isArray(assignment.data.classes)
											? assignment.data.classes[0].id
											: assignment.data.classes?.id)
									}
								>
									<ColoredPill
										color={
											assignment.data.classes
												? Array.isArray(assignment.data.classes)
													? assignment.data.classes[0].color
													: assignment.data.classes?.color
												: "blue"
										}
										hoverState
									>
										{assignment.data.classes
											? Array.isArray(assignment.data.classes)
												? assignment.data.classes[0].name
												: assignment.data.classes.name
											: "Error fetching class"}
									</ColoredPill>
								</Link>
								<div className="mt-4 w-full rounded-xl bg-gray-200 p-4">
									<h1 className="title mb-2 line-clamp-2">
										{assignment.data.name}
									</h1>
									<p className="text-gray-700 line-clamp-2">
										{assignment.data.description}
									</p>
								</div>
							</div>
							<div className="flex md:space-x-4">
								<CopiedHover copy={window.location.href}>
									<ButtonIcon icon={<LinkIcon className="h-5 w-5" />} />
								</CopiedHover>
								<div onClick={() => setFullscreen(!fullscreen)}>
									<ButtonIcon
										icon={
											fullscreen ? (
												<ArrowsPointingInIcon className="h-5 w-5" />
											) : (
												<ArrowsPointingOutIcon className="h-5 w-5" />
											)
										}
										className="hidden items-center justify-center md:flex"
									/>
								</div>
							</div>
						</section>
						<section className="scrollbar-fancy relative mt-5 flex flex-1 flex-col-reverse overflow-y-auto whitespace-pre-line md:pr-2 xl:flex-row">
							<div className="flex grow flex-col">
								<h2 className="text-xl font-semibold">Details</h2>
								<Editor
									editable={false}
									initialState={assignment.data.content}
									className=" scrollbar-fancy mt-2 mb-5 flex grow flex-col overflow-y-scroll rounded-xl bg-gray-200 p-4"
								/>
							</div>
							<div className="sticky mb-7 flex shrink-0 flex-col overflow-y-auto xl:top-0 xl:ml-4 xl:mb-0 xl:w-72">
								<h2 className="text-xl font-semibold">Submission</h2>
								<div className="mt-2 rounded-xl bg-gray-200 p-6">
									{assignment.data.submission_instructions ? (
										<>
											<h2 className="text-lg font-semibold ">
												Teachers Instructions:
											</h2>
											<p className="max-w-md text-sm text-gray-700">
												{assignment.data.submission_instructions}
											</p>
										</>
									) : (
										<h2 className="text-lg font-semibold ">
											Submit assignment
										</h2>
									)}
									<div
										className="mt-6 inline-flex cursor-pointer rounded-md bg-blue-500 px-4 py-1 font-semibold text-white"
										onClick={() => setIsOpen(true)}
									>
										Submit
									</div>
								</div>
							</div>
						</section>
					</div>
					<Transition appear show={isOpen} as={Fragment}>
						<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
							<Transition.Child
								enter="ease-out transition"
								enterFrom="opacity-75"
								enterTo="opacity-100 scale-100"
								leave="ease-in transition"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-75"
								as={Fragment}
							>
								<div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4">
									<Transition.Child
										enter="ease-out transition"
										enterFrom="opacity-75 scale-95"
										enterTo="opacity-100 scale-100"
										leave="ease-in transition"
										leaveFrom="opacity-100 scale-100"
										leaveTo="opacity-75 scale-95"
										as={Fragment}
									>
										<Dialog.Panel className="relative w-full max-w-md rounded-xl bg-white/75 p-4 shadow-md backdrop-blur-xl">
											<section className="my-10 flex items-center text-lg font-medium">
												This feature is temporarily disabled for the i2 showcase
											</section>

											<button
												onClick={() => setIsOpen(false)}
												className="absolute right-4 top-4 rounded p-0.5 text-gray-700 transition hover:bg-gray-300 hover:text-gray-900 focus:outline-none"
											>
												<XMarkIcon className="h-5 w-5" />
											</button>
										</Dialog.Panel>
									</Transition.Child>
								</div>
							</Transition.Child>
						</Dialog>
					</Transition>
				</>
			);
		}

		return <div>An unknown error occured. Assignment id: {assignmentid}</div>;
	}
};

export default Post;
