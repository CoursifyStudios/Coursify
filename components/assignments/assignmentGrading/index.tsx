/* eslint-disable @next/next/no-img-element */
import Avatar from "@/components/misc/avatar";
import {
	AllAssignments,
	TeacherAssignment,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import { Database } from "@/lib/db/database.types";
import { Disclosure } from "@headlessui/react";
import { SupabaseClient } from "@supabase/supabase-js";
import AssignmentHeader from "../assignmentPanel/header";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ColoredPill } from "@/components/misc/pill";
import { Button } from "@/components/misc/button";
import AssignmentGradingComponents from "./components";
import { SubmissionSettingsTypes } from "../assignmentPanel/submission.types";
import { useRouter } from "next/router";
import StudentSelector, { Student } from "./studentSelector";
import EditAssignment from "./settings/editAssignment";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

const AssignmentGradingUI = ({
	setAllAssignmentData,
	allAssignmentData,
	assignmentID,
	supabase,
	fullscreen,
	setFullscreen,
	setTeacherAssignments,
}: {
	setAllAssignmentData: Dispatch<SetStateAction<TeacherAssignmentResponse>>;
	supabase: SupabaseClient<Database>;
	allAssignmentData: TeacherAssignmentResponse;
	setTeacherAssignments: Dispatch<SetStateAction<AllAssignments | undefined>>;
	assignmentID: string;
	fullscreen: boolean;
	setFullscreen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [selectedID, setSelectedID] = useState<string>();
	const [grade, setGrade] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [editOpen, setEditOpen] = useState(false);
	const [datesOpen, setDatesOpen] = useState(false);

	const router = useRouter();

	const classData: TeacherAssignment = allAssignmentData.data!.classes!;
	const maxGrade = allAssignmentData.data?.max_grade ?? null;

	const students: Student[] = (classData.users ? classData.users : [])
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

	const [comment, setComment] = useState<string>("");

	const selectedStudent = useMemo(
		() => {
			const selectedStudent =
				selectedID == "" ? undefined : students.find((s) => s.id == selectedID);
			const recentSubmission = selectedStudent
				? selectedStudent.submissions.find((s) => s.final)
				: undefined;
			if (recentSubmission) {
				setComment(recentSubmission.comment || "");
				setGrade(recentSubmission.grade ?? 0);
			}
			return selectedStudent;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selectedID]
	);

	const totalStudents = students.length;

	const isGraded = (is: boolean): Student[] =>
		students.filter((student) =>
			student.submissions.length == 0 ||
			student.submissions.filter((s) => s.final).length == 0
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

	const setReviewed = async () => {
		const finalSubmission = selectedStudent!.submissions.find((s) => s.final);
		// update supabase
		await supabase
			.from("submissions")
			.update({
				grade: grade,
				comment: comment,
				final: true,
			})
			// Lukas was complaining that this isn't edge case supported so there you go lukas - Bloxs
			// MLH - Bill
			.eq(
				"id",
				finalSubmission
					? finalSubmission.id
					: selectedStudent!.submissions[0].id
			);

		// Update ui
		// @ts-expect-error
		setAllAssignmentData((data) => {
			if (!data.data || !data.data.classes) return data;
			return {
				...data,
				data: {
					...data.data,
					classes: {
						...data.data.classes,
						users: [
							...data.data.classes.users.filter((u) => u.id != selectedID),
							{
								...data.data.classes.users.find((u) => u.id == selectedID),
								submissions: [
									...data.data.classes.users
										.find((u) => u.id == selectedID)!
										.submissions.filter(
											(s) => s.id != selectedStudent!.submissions[0].id
										),
									{
										...selectedStudent!.submissions[0],
										comment: comment || null,
										grade: grade ?? 0,
										final: true,
									},
								],
							},
						],
					},
				},
			};
		});
	};

	const deleteAssignment = async () => {
		setLoading(true);

		const [assignment, submission] = await Promise.all([
			await supabase
				.from("submissions")
				.delete()
				.eq("assignment_id", assignmentID),
			await supabase.from("assignments").delete().eq("id", assignmentID),
		]);
		if (assignment.error || submission.error) {
			setError("An error occured while deleting this assignment");
			setLoading(false);
			return;
		}

		setLoading(false);

		// Update UI to reflect deletion -LS
		setTeacherAssignments((data) => {
			if (!data) return undefined;

			return data.filter((assignment) => assignment.id !== assignmentID);
		});

		router.push("/assignments/0");
	};

	const hideAssignment = {
		content: (
			<>
				Hide Assignment
				<EyeSlashIcon className="w-5 h-5 ml-auto" />
			</>
		),
	};

	return (
		<>
			<EditAssignment
				close={() => setEditOpen(false)}
				open={editOpen}
				assignment={allAssignmentData}
			/>
			<div className="flex grow flex-col">
				<AssignmentHeader
					setEditOpen={setEditOpen}
					setDatesOpen={setDatesOpen}
					teacher={true}
					assignment={allAssignmentData}
					fullscreen={fullscreen}
					setFullscreen={setFullscreen}
					deleteAssignment={deleteAssignment}
					error={error}
					loading={loading}
					hideAssignment={hideAssignment}
				/>
				<div className="flex">
					{/* prop drilling ftw -LS */}
					<StudentSelector
						graded={graded}
						maxGrade={maxGrade}
						notSubmitted={notSubmitted}
						selectedID={selectedID}
						setSelectedID={setSelectedID}
						totalStudents={totalStudents}
						ungraded={ungraded}
					/>
					{selectedStudent == undefined ? (
						<div className="flex grow items-center justify-center font-medium h-96">
							Select a student to get started
						</div>
					) : (
						<div className="flex grow flex-col ml-4 mt-4">
							<div className="flex justify-between bg-gray-200 h-36  p-3 rounded-xl">
								<div className="flex">
									<Avatar
										full_name={selectedStudent!.full_name}
										avatar_url={selectedStudent!.avatar_url}
										size="20"
										className="ml-2 min-w-[5rem]"
										text_size="xl"
									/>
									<div className="flex flex-col ml-4 justify-center">
										<h1 className="title truncate max-w-[12rem]">
											{selectedStudent.full_name}
										</h1>
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
													value={grade}
													onChange={(e) =>
														setGrade(
															e.target.value == ""
																? 0
																: parseInt(e.target.value)
														)
													}
												/>
												<span className="ml-2 text-xl">/{maxGrade}</span>
											</p>
										) : (
											<p className="text-xs max-w-[10rem]">
												Grading is disabled for this assignment
											</p>
										)}
									</div>
								</div>
								<div className="flex flex-col justify-between">
									<textarea
										placeholder="Enter an optional comment..."
										className="h-20 w-72 resize-none !rounded-xl scrollbar-fancy"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<div className="ml-auto gap-4 flex">
										<Button
											color="bg-blue-500"
											className="text-white"
											onClick={setReviewed}
											disabled={
												selectedStudent &&
												selectedStudent.submissions.find((s) => s.final)
													? selectedStudent.submissions.find((s) => s.final)!
															.comment == comment &&
													  selectedStudent.submissions.find((s) => s.final)!
															.grade == grade &&
													  graded.some((student) => student.id == selectedID)
													: false
											}
										>
											{graded.some((student) => student.id == selectedID)
												? maxGrade
													? "Update Grade"
													: "Update Review"
												: maxGrade
												? "Grade Assignment"
												: "Set Reviewed"}
										</Button>
									</div>
								</div>
							</div>
							<div className="flex flex-col rounded-xl mt-4">
								<AssignmentGradingComponents
									assignmentData={allAssignmentData}
									submission={
										selectedStudent.submissions.find((s) => s.final)
											?.content as SubmissionSettingsTypes
									}
									latestSubmission={
										selectedStudent.submissions[0]
											.content as SubmissionSettingsTypes
									}
									selectedStudent={selectedStudent}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default AssignmentGradingUI;
