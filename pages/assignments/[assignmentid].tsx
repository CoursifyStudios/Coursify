import { Loading } from "@/components/assignments/loading";
import { AssignmentSettingsTypes } from "@/components/assignments/assignmentCreation/three/settings.types";
import AssignmentHeader from "@/components/assignments/assignmentPanel/header";
import { Submission } from "@/components/assignments/assignmentPanel/submission.types";
import Editor from "@/components/editors/richeditor";
import { NextPageWithLayout } from "@/pages/_app";
import Layout from "@/components/layout/layout";
import {
	AllAssignments,
	AssignmentTypes,
	StudentAssignmentResponse,
	TeacherAssignmentResponse,
	getAllAssignments,
	getStudentAssignment,
	getTeacherAssignment,
} from "@/lib/db/assignments/assignments";
import { Database } from "@/lib/db/database.types";

import { getDataOutArray } from "@/lib/misc/dataOutArray";
import launch from "@/public/svgs/launch.svg";
import noData from "@/public/svgs/no-data.svg";
import { AssignmentPreview } from "@assignments/assignments";
import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SerializedEditorState } from "lexical";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import AssignmentGradingUI from "@/components/assignments/assignmentGrading";

const Panel = dynamic(
	() => import("@/components/assignments/assignmentPanel"),
	{
		loading: () => (
			<div className="animate-pulse">
				<p className="w-max rounded-md bg-gray-300">
					<span className="invisible">We should probably use fixed</span>
				</p>
				<p className="mt-2 w-max rounded-md bg-gray-300">
					<span className="invisible">widths for these lol...</span>
				</p>
			</div>
		),
	}
);

const Post: NextPageWithLayout = () => {
	const supabase = useSupabaseClient<Database>();
	const [studentAssignments, setStudentAssignments] =
		useState<AllAssignments>();
	const [teacherAssignments, setTeacherAssignments] =
		useState<AllAssignments>();
	const [assignment, setAssignment] = useState<
		StudentAssignmentResponse | TeacherAssignmentResponse
	>();
	const router = useRouter();
	const user = useUser();
	const { assignmentid } = router.query;
	const [fullscreen, setFullscreen] = useState(false);
	const [revisions, setRevisions] = useState<Submission[]>([]);
	const [tab, setTab] = useState(0);

	const options = [
		{ name: "Relevance" }, //still no idea what this is supposed to do
		{ name: "Due Date" }, //we'll add an ascending/ descending button later. like pcpartpicker.com
		//{ name: "Assign Date" },
		//{ name: "Class Order"},
	];

	const [selected, setSelected] = useState(options[0]);
	useEffect(() => {
		(async () => {
			if (user && !(studentAssignments && teacherAssignments)) {
				const rawData = await getAllAssignments(supabase, user.id);
				let sAssignments: AllAssignments = [];
				let tAssignments: AllAssignments = [];

				if (rawData.data) {
					rawData.data.forEach((a) => {
						if (!a.classes) return;
						if (a.teacher) {
							tAssignments = tAssignments.concat(a.classes.assignments);
						} else {
							sAssignments = sAssignments.concat(a.classes.assignments);
						}
					});
				}
				if (sAssignments.length == 0) {
					setTab(1);
				}
				setTeacherAssignments(
					tAssignments.length > 0 ? tAssignments : undefined
				);
				setStudentAssignments(
					sAssignments.length > 0
						? sAssignments //.sort((a, b) => {
						: // 	const aScore =
						  // 		a.submissions.length > 0
						  // 			? a.submissions.some((s) => s.final == true)
						  // 				? 2
						  // 				: 1
						  // 			: 0;
						  // 	const bScore =
						  // 		b.submissions.length > 0
						  // 			? b.submissions.some((s) => s.final == true)
						  // 				? 2
						  // 				: 1
						  // 			: 0;
						  // 	return aScore - bScore;
						  // })
						  undefined
				);
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, supabase, router, assignmentid, assignment]);

	useEffect(() => {
		(async () => {
			if (
				user &&
				router.isReady &&
				typeof assignmentid == "string" &&
				assignmentid != "0" &&
				(assignment
					? assignment?.data && assignment?.data.id != assignmentid
					: true) &&
				studentAssignments &&
				teacherAssignments
			) {
				setAssignment(undefined);
				const isTeacher = teacherAssignments.some(
					(ta) => ta.id == assignmentid
				);

				const assignment = await (isTeacher
					? getTeacherAssignment(supabase, assignmentid)
					: getStudentAssignment(supabase, assignmentid, user.id));

				setAssignment(assignment);
				if (assignment.data && "submissions" in assignment.data)
					setRevisions(assignment.data.submissions as Submission[]);
			}
		})();
		// Mobile support makes it sorta like using gmail on mobile, optimized for assignments
		if (router.isReady && assignmentid != "0" && window.innerWidth < 768) {
			setFullscreen(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		user,
		supabase,
		router,
		assignmentid,
		assignment,
		studentAssignments,
		teacherAssignments,
	]);

	return (
		// Left pane
		<div className="mx-auto flex w-full max-w-screen-xl px-4 pb-6 pt-6 md:px-8 xl:px-0 ">
			<div
				className={`scrollbar-fancy mr-4 grow items-stretch overflow-x-clip md:grow-0 sticky top-8 ${
					fullscreen ? "hidden" : "flex"
				} w-[20.5rem] shrink-0 flex-col space-y-5 overflow-y-scroll p-1 pb-6 compact:space-y-3 md:h-[calc(100vh-6.5rem)] `}
			>
				<h2 className="title">Your Assignments</h2>
				{(teacherAssignments || studentAssignments) && user ? (
					<Tab.Group selectedIndex={tab} onChange={setTab}>
						{!(!teacherAssignments || !studentAssignments) && (
							<Tab.List as="div" className="flex items-center">
								<Tab as={Fragment}>
									{({ selected }) => (
										<div
											className={`flex cursor-pointer items-center rounded-lg border px-2 py-1 focus:outline-none ${
												selected
													? "brightness-focus"
													: "border-transparent bg-gray-200"
											} text-sm font-medium`}
										>
											Student
										</div>
									)}
								</Tab>
								<Tab as={Fragment}>
									{({ selected }) => (
										<div
											className={`ml-4 flex cursor-pointer items-center rounded-lg border px-2 py-1 focus:outline-none ${
												selected
													? "brightness-focus"
													: "border-transparent bg-gray-200"
											} text-sm font-medium`}
										>
											Teacher
										</div>
									)}
								</Tab>
							</Tab.List>
						)}
						<Tab.Panels>
							{studentAssignments ? (
								<Tab.Panel className="space-y-5 flex flex-col compact:space-y-2">
									{studentAssignments.map(
										(assignment) =>
											assignment.classes && (
												<AssignmentPreview
													key={assignment.id}
													supabase={supabase}
													assignment={assignment}
													userId={user.id}
													starredAsParam={
														assignment.starred
															? Array.isArray(assignment.starred)
																? assignment.starred.length > 0
																: !!assignment.starred
															: false
													}
													showClassPill={true}
													classes={getDataOutArray(assignment.classes)}
													className={`${
														assignmentid == assignment.id
															? "brightness-focus"
															: "brightness-hover bg-backdrop-200"
													} border border-transparent`}
												/>
											)
									)}
								</Tab.Panel>
							) : (
								<Tab.Panel></Tab.Panel>
							)}
							{teacherAssignments ? (
								<Tab.Panel className="space-y-5 flex flex-col compact:space-y-2">
									{teacherAssignments.map(
										(assignment) =>
											assignment.classes && (
												<AssignmentPreview
													key={assignment.id}
													supabase={supabase}
													assignment={assignment}
													userId={user.id}
													starredAsParam={
														assignment.starred
															? Array.isArray(assignment.starred)
																? assignment.starred.length > 0
																: !!assignment.starred
															: false
													}
													showClassPill={true}
													classes={getDataOutArray(assignment.classes)}
													className={`${
														assignmentid == assignment.id
															? "brightness-focus"
															: "brightness-hover bg-backdrop-200"
													} border border-transparent `}
												/>
											)
									)}
								</Tab.Panel>
							) : (
								<Tab.Panel></Tab.Panel>
							)}
						</Tab.Panels>
					</Tab.Group>
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
				{/* <div className="flex flex-col">
					<div className="flex-col rounded-lg bg-backdrop-200 p-2">
						<div className="mb-1 flex items-center">
							<h1 className="mr-1 text-xl font-bold">Filters</h1>
							<Info
								size="small"
								className="my-auto ml-2 shadow shadow-black/25"
							>
								Add filters to specify which types of assignments you see.
							</Info>
						</div>
						<div className="flex flex-wrap">
							<div className="mt-2 items-center justify-center rounded-lg bg-gray-300 p-1">
								<PlusIcon className=" h-6 w-6" />
							</div>
						</div>
					</div>
					<div className="mt-3 flex items-center justify-between">
						<div className="flex items-center">
							<h2 className="mr-1 text-xl font-bold">Sort</h2>
							<Info size="small" className="my-auto ml-2">
								Sort by different attributes of assignments
							</Info>
						</div>
						<Dropdown
							onChange={setSelected}
							selectedValue={selected}
							values={options}
						/>
					</div>
				</div> */}
			</div>
			<div
				className={`grow rounded-xl px-4  ${
					fullscreen ? "flex" : "hidden md:flex"
				} 
				${tab == 0 && "md:h-[calc(100vh-6.5rem)]"}
				`}
			>
				<AssignmentPane />
			</div>
		</div>
	);

	function AssignmentPane() {
		const [open, setOpen] = useState(false);
		if (
			!router.isReady ||
			!(teacherAssignments || studentAssignments) ||
			(!assignment && assignmentid != "0")
		) {
			return <Loading />;
		}

		if (
			assignmentid == "0" ||
			(tab == 0 &&
				teacherAssignments &&
				teacherAssignments.some((ta) => assignmentid == ta.id)) ||
			(tab == 1 &&
				studentAssignments &&
				studentAssignments.some((ta) => assignmentid == ta.id))
		) {
			// 0 is a placeholder for when the user hasn't selected an assignment yet
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src={launch}
						alt="Nothing present icon"
						width={150}
						height={150}
						draggable={false}
						className="select-none"
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
						This assignment {"doesn't"} exist (or you don{"'"}t have access to
						it)
					</h1>
				</div>
			);
		}

		if (assignment?.data) {
			if (
				tab == 1 &&
				!("submissions" in assignment) &&
				typeof assignmentid == "string"
			) {
				return (
					<AssignmentGradingUI
						allAssignmentData={assignment as TeacherAssignmentResponse}
						setTeacherAssignments={setTeacherAssignments}
						assignmentID={assignmentid}
						fullscreen={fullscreen}
						setFullscreen={setFullscreen}
						supabase={supabase}
					/>
				);
			}
			return (
				<>
					<div className="flex grow flex-col">
						{/* Top part of main window */}
						<AssignmentHeader
							assignment={assignment}
							fullscreen={fullscreen}
							setFullscreen={setFullscreen}
						/>
						<section
							className={`scrollbar-fancy relative mt-5 flex flex-1  overflow-y-auto overflow-x-hidden whitespace-pre-line md:pr-2 ${
								assignment.data.type == AssignmentTypes.DISCUSSION_POST
									? "flex-col"
									: "flex-col-reverse xl:flex-row"
							}`}
						>
							<div
								className={`flex flex-col ${
									assignment.data.type == AssignmentTypes.DISCUSSION_POST
										? "h-max"
										: "grow"
								}`}
							>
								<h2 className="text-xl font-semibold">Details</h2>
								{assignment.data.content &&
								(assignment.data.content as unknown as SerializedEditorState) // @ts-expect-error lexical/shit-types
									.root.children[0].children.length != 0 ? (
									<Editor
										editable={false}
										initialState={assignment.data.content}
										className=" scrollbar-fancy mb-5 mt-2 flex grow flex-col overflow-y-scroll rounded-xl bg-gray-200 p-5"
										focus={false}
									/>
								) : (
									<>
										<div className="mb-5 mt-2 grid grow place-items-center rounded-xl bg-gray-200 p-5 text-lg font-medium">
											No assignment details
										</div>
									</>
								)}
							</div>
							{assignment.data.type != AssignmentTypes.DISCUSSION_POST ? (
								<div
									className={`sticky mb-7 flex shrink-0 flex-col  xl:top-0 xl:mb-0 xl:ml-4 xl:w-72 `}
								>
									<h2 className="text-xl font-semibold">Submission</h2>
									<div
										className={`mt-2 rounded-xl overflow-y-auto scrollbar-fancy bg-gray-200 ${
											open ? "max-h-16 p-1" : "max-h-[32rem] px-5 py-4"
										}  overflow-hidden transition-all duration-300`}
									>
										{!open ? (
											<>
												{assignment.data.submission_instructions ? (
													<>
														<h2 className="text-lg font-semibold ">
															Teacher{"'"}s Instructions:
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
												<div className="mt-4 flex flex-col space-y-4">
													<Panel
														assignmentType={assignment.data.type}
														setRevisions={setRevisions}
														revisions={revisions}
														settings={
															assignment.data
																.settings as unknown as AssignmentSettingsTypes
														}
														assignmentID={
															Array.isArray(assignmentid!)
																? assignmentid[0]
																: assignmentid!
														}
													/>
												</div>
											</>
										) : (
											<h2
												className="cursor-pointer px-4 py-3 text-lg font-semibold"
												onClick={() => setOpen(false)}
											>
												Back to Submission...
											</h2>
										)}
									</div>
									{revisions.length > 0 && (
										<div
											className={`mt-4  flex flex-col rounded-xl bg-gray-200 `}
										>
											<button
												className="flex items-center px-5 py-4"
												onClick={() => setOpen((open) => !open)}
											>
												<h3 className="text-lg font-semibold">
													Revision History
												</h3>
												<BarsArrowDownIcon className="ml-auto h-6 w-6" />
											</button>

											{open && (
												<>
													<div className="px-5 pb-4">
														Revision history is coming soon
													</div>
												</>
											)}
										</div>
									)}
								</div>
							) : (
								<div className="flex flex-col ">
									<h2 className="text-xl font-semibold">Discussion Posts</h2>
									<Panel
										assignmentType={assignment.data.type}
										setRevisions={setRevisions}
										revisions={revisions}
										settings={
											assignment.data
												.settings as unknown as AssignmentSettingsTypes
										}
										assignmentID={
											Array.isArray(assignmentid!)
												? assignmentid[0]
												: assignmentid!
										}
									/>
								</div>
							)}
						</section>
					</div>
				</>
			);
		}
		// Typescript wanted me to do this. The user shouldn't ever encounter this state
		return <div>An unknown error occurred. Assignment id: {assignmentid}</div>;
	}
};

export default Post;

Post.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};
