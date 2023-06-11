import { Form, Formik } from "formik";
import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";
import * as Yup from "yup";
import { NewAssignmentData } from "../../../../lib/db/assignments";
import { Button } from "../../../misc/button";
import { useAssignmentStore } from "../assignmentCreation";
import { submissionType } from "../assignmentCreation/submissionType";

const AssignmentSpecificDetails: NextPage<{
	stage: number;
	setStage: Dispatch<SetStateAction<number>>;
}> = ({ setStage, stage }) => {
	const { data: assignmentData, set: setAssignmentData } = useAssignmentStore();
	if (stage != 3) return null;
	return (
		<>
			<h2 className="mt-6 text-xl font-bold">
				{
					submissionType.find(
						(submission) => submission.type == assignmentData?.type
					)?.name
				}{" "}
				Submission Details
			</h2>
			<Formik
				validationSchema={Yup.object({
					name: Yup.string().min(3).max(40).required(),
					description: Yup.string().min(3).max(60).required(),
					submissionType: Yup.string().min(3).max(100),
					maxGrade: Yup.number(),
				})}
				initialValues={{
					name: assignmentData?.name || "",
					description: assignmentData?.description || "",
					submissionInstructions: assignmentData?.submissionInstructions || "",
					maxGrade: assignmentData?.maxGrade || undefined,
				}}
				onSubmit={(values) => {
					setAssignmentData({
						...values,
					} as NewAssignmentData);
				}}
			>
				{({ submitForm, values, errors }) => (
					<Form className="mt-10 flex flex-col space-y-3 ">
						<div className="ml-auto flex space-x-4">
							<span onClick={() => setStage((stage) => stage - 1)}>
								<Button>Prev</Button>
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
											(Object.keys(errors).length == 0)
											//  &&
											// values.name &&
											// values.description
										)
									}
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
};

export default AssignmentSpecificDetails;
