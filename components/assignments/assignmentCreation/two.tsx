import { ErrorMessage, Field, Form, Formik } from "formik";
import { EditorState } from "lexical";
import { Dispatch, SetStateAction, useState } from "react";
import * as Yup from "yup";
import { useAssignmentStore } from ".";

import Editor from "@/components/editors/richeditor";
import { Button } from "@/components/misc/button";
import { Info } from "@/components/tooltips/info";
import {
	AssignmentTypes,
	NewAssignmentData,
	TeacherAssignment,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import { submissionType } from "./submissionType";
import GenericFileUpload, {
	CoursifyFile,
} from "@/components/files/genericFileUpload";
import { Json } from "@/lib/db/database.types";

export default function AssignmentDetails({
	stage,
	setStage,
	customAssignment,
	save,
}: {
	stage: number;
	setStage?: Dispatch<SetStateAction<number>>;
	save?: (assignment: AssignmentSaveData) => void;
	customAssignment?: TeacherAssignmentResponse["data"];
}) {
	const [files, setFiles] = useState<CoursifyFile[]>(
		customAssignment
			? customAssignment.files
				? (customAssignment.files as unknown as CoursifyFile[])
				: []
			: []
	);
	const [editorState, setEditorState] = useState<EditorState>();
	const { data: assignmentData, set: setAssignmentData } = useAssignmentStore();

	if (stage != 2) return null;

	return (
		<>
			{setStage && (
				<h2 className="mt-6 text-xl font-bold">
					Create Assignment -{" "}
					{
						submissionType.find(
							(submission) => submission.type == assignmentData?.type
						)?.name
					}
				</h2>
			)}
			<Formik
				validationSchema={Yup.object({
					name: Yup.string().min(3).max(40).required(),
					description: Yup.string().min(3).max(60).required(),
					submissionInstructions: Yup.string().min(3).max(100),
					maxGrade: Yup.number().min(0, "Grade cannot be negative"),
				})}
				initialValues={{
					name: customAssignment?.name || assignmentData?.name || "",
					description:
						customAssignment?.description || assignmentData?.description || "",
					submissionInstructions:
						customAssignment?.submission_instructions ||
						assignmentData?.submissionInstructions ||
						"",
					maxGrade:
						customAssignment?.max_grade ||
						assignmentData?.maxGrade ||
						undefined,
				}}
				onSubmit={(values) => {
					const serializedEditor = editorState?.toJSON();
					if (save) {
						save({
							...values,
							content: (JSON.stringify(serializedEditor) ==
							JSON.stringify(defaultEditorState)
								? undefined
								: serializedEditor) as unknown as Json,
							files,
						});
					}
					setAssignmentData({
						...values,
						content:
							JSON.stringify(serializedEditor) ==
							JSON.stringify(defaultEditorState)
								? undefined
								: serializedEditor,
						files: files,
					} as NewAssignmentData);
				}}
			>
				{({ submitForm, values, errors }) => (
					<Form className="mt-10 flex flex-col space-y-3 ">
						<div className="flex w-full gap-3">
							<label htmlFor="name" className="flex grow flex-col">
								<span className="text-sm font-medium">
									Assignment Name <span className="text-red-600">*</span>
								</span>
								<Field
									className="mt-1"
									type="text"
									name="name"
									autoFocus
									autocomplete="off"
								/>
								<div className="text-sm text-red-600">
									<ErrorMessage name="name" />
								</div>
							</label>
							<label htmlFor="maxGrade" className="flex w-[7.5rem] flex-col">
								<div className="flex w-full items-center justify-between">
									<span className="text-sm font-medium">Max Points</span>
									<Info size="large">
										The highest number of points that a student can earn on the
										assignment. Going over this value will be extra credit.
									</Info>
								</div>

								<Field className="mt-1" type="number" name="maxGrade" />
								<div className="text-sm text-red-600">
									<ErrorMessage name="maxGrade" />
								</div>
							</label>
						</div>

						<label htmlFor="description" className="flex flex-col">
							<span className="text-sm font-medium">
								Short Description <span className="text-red-600">*</span>
							</span>
							<Field
								className="mt-1"
								type="text"
								name="description"
								autocomplete="off"
							/>
							<div className="text-sm text-red-600">
								<ErrorMessage name="description" />
							</div>
						</label>
						<label htmlFor="submissionInstructions" className="flex flex-col">
							<span className="text-sm font-medium">
								Submission Instructions
							</span>
							<Field
								className="mt-1"
								type="text"
								name="submissionInstructions"
								autocomplete="off"
							/>
							<div className="text-sm text-red-600">
								<ErrorMessage name="submissionInstructions" />
							</div>
						</label>
						<span className="translate-y-2 text-sm font-medium">
							Full Length Description
						</span>
						<Editor
							editable
							updateState={setEditorState}
							initialState={
								customAssignment?.content || assignmentData?.content
							}
							className="scrollbar-fancy mb-6 rounded-md border border-gray-300 bg-backdrop/50 pb-2 focus:ring-1 min-h-[6rem] "
							focus={false}
						/>
						<GenericFileUpload
							files={files}
							setFiles={setFiles}
							destination={"assignments"}
						/>
						{!setStage ? (
							<Button
								onClick={() => {
									submitForm();
								}}
								type="submit"
								color="bg-blue-500"
								className="text-white ml-auto"
								disabled={
									!(
										Object.keys(errors).length == 0 &&
										values.name &&
										values.description
									)
								}
							>
								Save
							</Button>
						) : (
							<div className="ml-auto flex space-x-4">
								<span onClick={() => setStage((stage) => stage - 1)}>
									<Button>Back</Button>
								</span>

								<span
									onClick={() => {
										submitForm();
										setStage((stage) => stage + 1);
									}}
								>
									<Button
										color="bg-blue-500"
										className="text-white "
										disabled={
											!(
												Object.keys(errors).length == 0 &&
												values.name &&
												values.description
											)
										}
									>
										Next
									</Button>
								</span>
							</div>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}

export interface AssignmentSaveData {
	name: string;
	description: string;
	submissionInstructions: string;
	maxGrade: number | undefined;
	content: Json;
	files: CoursifyFile[];
}

const defaultEditorState = {
	root: {
		children: [
			{
				children: [],
				direction: null,
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1,
			},
		],
		direction: null,
		format: "",
		indent: 0,
		type: "root",
		version: 1,
	},
};
