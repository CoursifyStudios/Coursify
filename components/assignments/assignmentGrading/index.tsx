/* eslint-disable @next/next/no-img-element */
import Avatar from "@/components/misc/avatar";
import {
	TeacherAssignment,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import { Database } from "@/lib/db/database.types";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { SupabaseClient } from "@supabase/supabase-js";
import AssignmentHeader from "../assignmentPanel/header";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ColoredPill } from "@/components/misc/pill";
import { Button } from "@/components/misc/button";

const AssignmentGradingUI = ({
	allAssignmentData,
	assignmentID,
	supabase,
	fullscreen,
	setFullscreen,
}: {
	supabase: SupabaseClient<Database>;
	allAssignmentData: TeacherAssignmentResponse;
	assignmentID: string;
	fullscreen: boolean;
	setFullscreen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [selectedID, setSelectedID] = useState<string>();

	const classData: TeacherAssignment = allAssignmentData.data!.classes!;
	const maxGrade = allAssignmentData.data?.max_grade ?? null;

	const students = (classData.users ? classData.users : [])
		.filter(
			(user) =>
				classData.class_users.find((cu) => cu.user_id == user.id)?.teacher ==
				false
		)
		.map((student) => ({
			...student,
			submissions: student.submissions.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			),
		}));

	const selectedStudent = useMemo(
		() =>
			selectedID == "" ? undefined : students.find((s) => s.id == selectedID),
		[selectedID, students]
	);
	const totalStudents = students.length - 1;

	const isGraded = (is: boolean) =>
		students.filter((student) =>
			student.submissions.length == 0
				? false
				: !is
				? student.submissions.filter((s) => s.final)[0].grade == null
				: student.submissions.filter((s) => s.final)[0].grade != null
		);

	const notSubmitted = students.filter(
		(student) =>
			student.submissions.length < 1 ||
			!student.submissions.some((s) => s.final)
	);

	const ungraded = isGraded(false);

	const graded = isGraded(true);

	if (totalStudents == 0) {
		return <div>No students found in this class.</div>;
	}

	return (
		<div className="flex grow flex-col">
			<AssignmentHeader
				assignment={allAssignmentData}
				fullscreen={fullscreen}
				setFullscreen={setFullscreen}
			/>
			<div className="flex">
				<div className="flex w-64 my-2 mt-4 flex-col">
					<div className=" rounded-xl flex flex-col">
						<Disclosure defaultOpen>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
										<span>Ungraded</span>
										<ColoredPill color="gray" className="ml-auto">
											{ungraded.length}
										</ColoredPill>
										{/* <ChevronUpIcon
											className={`${
												open ? "rotate-180 transform" : ""
											} h-5 w-5 ml-auto`}
										/> */}
									</Disclosure.Button>
									<Disclosure.Panel className=" pt-2 pb-4 text-sm flex flex-col  gap-4">
										{ungraded.length != 0 ? (
											ungraded.map((student) => (
												<button
													key={student.id}
													className="p-3 bg-backdrop-200 rounded-xl flex items-center brightness-hover text-left"
													onClick={() => setSelectedID(student.id)}
												>
													<img
														src={student.avatar_url}
														className="rounded-full h-10 w-10"
														alt="user profile picture"
													/>
													<div className="ml-3">
														<p className="font-medium">{student.full_name}</p>
														<p className="text-xs">
															{new Intl.DateTimeFormat("en-US", {
																month: "2-digit",
																day: "2-digit",
																year: "numeric",
																hour: "numeric",
																minute: "numeric",
															}).format(
																new Date(
																	student.submissions.find((s) => s.final)
																		?.created_at || ""
																)
															)}{" "}
														</p>
													</div>
												</button>
											))
										) : (
											<p className="font-medium text-center">
												You{"'"}ve graded all submissions!
											</p>
										)}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<Disclosure defaultOpen>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
										<span>Not Submitted</span>
										<ColoredPill color="gray" className="ml-auto">
											{notSubmitted.length}
										</ColoredPill>
										{/* <ChevronUpIcon
											className={`${
												open ? "rotate-180 transform" : ""
											} h-5 w-5 ml-auto`}
										/> */}
									</Disclosure.Button>
									<Disclosure.Panel className=" pt-2 pb-4 text-sm flex flex-col gap-4">
										{notSubmitted.length != 0 ? (
											notSubmitted.map((student) => (
												<button
													key={student.id}
													disabled={student.submissions.length == 0}
													className={`p-3 bg-backdrop-200 rounded-xl flex items-center text-left ${
														student.submissions.length != 0 &&
														"brightness-hover"
													}`}
													onClick={() => setSelectedID(student.id)}
												>
													<img
														src={student.avatar_url}
														className="rounded-full h-10 w-10"
														alt="user profile picture"
													/>
													<div className="ml-3">
														<p className="font-medium">{student.full_name}</p>
														{student.submissions.length != 0 && (
															<p className="text-xs">Draft submitted</p>
														)}
													</div>
												</button>
											))
										) : (
											<p className="font-medium text-center">
												All students have submitted!
											</p>
										)}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<Disclosure defaultOpen>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
										<span>{maxGrade == null ? "Reviewed" : "Graded"} </span>
										<ColoredPill color="gray" className="ml-auto">
											{graded.length}/{totalStudents + 1}
										</ColoredPill>
										{/* <ChevronUpIcon
											className={`${
												open ? "rotate-180 transform" : ""
											} h-5 w-5 ml-auto`}
										/> */}
									</Disclosure.Button>
									<Disclosure.Panel className=" pt-2 pb-4 text-sm flex flex-col  gap-4">
										{graded.length != 0 ? (
											graded.map((student) => (
												<button
													key={student.id}
													onClick={() => setSelectedID(student.id)}
													className={`p-3 bg-backdrop-200 rounded-xl flex items-center text-left brightness-hover`}
												>
													<img
														src={student.avatar_url}
														className="rounded-full h-10 w-10"
														alt="user profile picture"
													/>
													<div className="ml-3">
														<p className="font-medium">{student.full_name}</p>
														{maxGrade != null && (
															<p className="text-xs">
																Grade:{" "}
																{
																	student.submissions.find((s) => s.final)
																		?.grade
																}
																/{maxGrade}
															</p>
														)}
													</div>
												</button>
											))
										) : (
											<p className="font-medium text-center">
												You haven{"'"}t graded any submissions yet!
											</p>
										)}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					</div>
				</div>
				{selectedStudent == undefined ? (
					<div className="flex grow items-center justify-center font-medium">
						Select an student to get started
					</div>
				) : (
					<div className="flex grow justify-between bg-gray-200 h-32 m-4 p-2 rounded-xl">
						<div className="flex">
							<Avatar
								full_name={selectedStudent!.full_name}
								avatar_url={selectedStudent!.avatar_url}
								size="20"
								className="ml-4 w-20"
								text_size="xl"
							/>
							<div className="flex flex-col ml-4 justify-center">
								<h1 className="title">{selectedStudent.full_name}</h1>
								{maxGrade ? (
									<p className="text-lg font-medium flex items-end mt-2">
										<input
											type="text"
											className="w-24 py-1 px-2"
											placeholder={
												selectedStudent.submissions
													.find((s) => s.final)
													?.grade?.toString() || ""
											}
										/>
										<span className="ml-2 text-xl">/{maxGrade}</span>
									</p>
								) : (
									<p className="text-xs">
										Grading is disabled for this assignment
									</p>
								)}
							</div>
						</div>
						<div className="flex flex-col justify-between">
							<textarea
								placeholder="Enter a comment..."
								className=" w-72 resize-none !rounded-xl"
							/>
							<div className="ml-auto gap-4 flex">
								{/* <Button color="bg-gray-300" className="text-white">
									Back
								</Button>
								<Button color="bg-blue-500" className="text-white">
									Next
								</Button> */}
								<Button color="bg-blue-500" className="text-white">
									Reviewed
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AssignmentGradingUI;
