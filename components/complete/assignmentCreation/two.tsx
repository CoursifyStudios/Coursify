import { useFormikContext, Formik, Form, Field, ErrorMessage } from "formik";
import { EditorState, SerializedEditorState } from "lexical";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "../../misc/button";
import { submissionType, useAssignmentStore } from ".";
import * as Yup from "yup";
import Editor from "../../editors/richeditor";
import { AssignmentTypes } from "../../../lib/db/assignments";

export default function AssignmentDetails({
	stage,
	setStage,
	assignmentType,
	content,
	setContent,
}: {
	stage: number;
	setStage: Dispatch<SetStateAction<number>>;
	assignmentType: AssignmentTypes | undefined;
	content: SerializedEditorState | undefined;
	setContent: Dispatch<SetStateAction<SerializedEditorState | undefined>>;
}) {
	const [editorState, setEditorState] = useState<EditorState>();
	const [disabled, setDisabled] = useState(true);
	const { setAssignmentData, assignmentData } = useAssignmentStore((state) => ({
		setAssignmentData: state.set,
		assignmentData: state.data,
	}));

	if (stage != 2) return null;

	const AssignmentWatcher = () => {
		const { errors, values } = useFormikContext();

		useEffect(() => {
			if (
				Object.keys(errors).length == 0 &&
				//@ts-expect-error Formik "types" are a joke
				values.name &&
				//@ts-expect-error Formik "types" are a joke
				values.description
			) {
				setDisabled(false);
			} else {
				if (disabled != true) {
					setDisabled(true);
				}
			}
		}, [errors, values]);

		return null;
	};

	return (
		<>
			<h2 className="mt-6 text-xl font-bold">
				Create Assignment -{" "}
				{
					submissionType.find((submission) => submission.type == assignmentType)
						?.name
				}
			</h2>
			<Formik
				validationSchema={Yup.object({
					name: Yup.string().min(3).max(40).required(),
					description: Yup.string().min(3).max(60).required(),
					submission: Yup.string().min(3).max(100),
				})}
				initialValues={{
					name: assignmentData?.name || "",
					description: assignmentData?.description || "",
					submissionType: assignmentData?.submissionType || "",
				}}
				onSubmit={(values) => {
					setAssignmentData(values);
				}}
			>
				{({ submitForm }) => (
					<Form className="mt-10 flex flex-col space-y-3 ">
						<AssignmentWatcher />
						<label htmlFor="name" className="flex flex-col">
							<span className="text-sm font-medium">
								Assignment Name <span className="text-red-600">*</span>
							</span>
							<Field
								className="mt-1 rounded-md border-gray-300 bg-white/50 focus:ring-1"
								type="text"
								name="name"
							/>
							<div className="text-sm text-red-600">
								<ErrorMessage name="name" />
							</div>
						</label>
						<label htmlFor="description" className="flex flex-col">
							<span className="text-sm font-medium">
								Short Description <span className="text-red-600">*</span>
							</span>
							<Field
								className="mt-1 rounded-md border-gray-300  bg-white/50 focus:ring-1"
								type="text"
								name="description"
							/>
							<div className="text-sm text-red-600">
								<ErrorMessage name="description" />
							</div>
						</label>
						<label htmlFor="submissionType" className="flex flex-col">
							<span className="text-sm font-medium">
								Submission Instructions
							</span>
							<Field
								className="mt-1 rounded-md border-gray-300  bg-white/50 focus:ring-1"
								type="text"
								name="submissionType"
							/>
							<div className="text-sm text-red-600">
								<ErrorMessage name="submissionType" />
							</div>
						</label>
						<span className="text-sm font-medium">Full Length Description</span>
						<Editor
							editable
							updateState={setEditorState}
							initialState={content}
							className="scrollbar-fancy mt-1 mb-6 max-h-[30vh] min-h-[6rem] overflow-y-auto overflow-x-hidden rounded-md border border-gray-300 bg-white/50 pb-2 focus:ring-1"
							focus={true}
						/>
						<div className="ml-auto flex space-x-4">
							<span onClick={() => setStage((stage) => stage - 1)}>
								<Button>Prev</Button>
							</span>

							<span
								onClick={() => {
									submitForm();
									setContent(editorState?.toJSON());
									setStage((stage) => stage + 1);
								}}
							>
								<Button
									color="bg-blue-500"
									className="text-white "
									disabled={disabled}
								>
									Next
								</Button>
							</span>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
