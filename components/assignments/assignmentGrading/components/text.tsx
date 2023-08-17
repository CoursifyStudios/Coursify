import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionLink,
	SubmissionText,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editors/richeditor"));

const TextGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionText;
}) => {
	return (
		<>
			<div className="p-4 bg-backdrop-200 rounded-xl flex">
				{typeof submission.content == "string" ? (
					submission.content
				) : (
					// empty className resets stypes
					<Editor
						editable={false}
						initialState={submission.content}
						className=" "
					/>
				)}
			</div>
		</>
	);
};

export default TextGrading;
