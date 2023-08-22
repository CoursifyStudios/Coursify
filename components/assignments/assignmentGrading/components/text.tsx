import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionLink,
	SubmissionText,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AssignmentText } from "../../assignmentCreation/three/settings.types";

const Editor = dynamic(() => import("@/components/editors/richeditor"));

const TextGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionText;
}) => {
	const [text, setText] = useState(
		typeof submission.content == "string" ? submission.content : ""
	);

	const settings = assignmentData.data?.settings as unknown as AssignmentText;

	const textLength = useMemo(() => {
		if (settings.trueWhenChars) return text.length;
		else return (text.match(/\S+/g) || []).length;
	}, [text, settings]);

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
						updateRaw={setText}
					/>
				)}
			</div>
			<ColoredPill color="gray" className="mt-2 ml-auto text-sm">
				<div>
					{textLength}
					{settings.maxChars && ` / ${settings.maxChars}`}{" "}
					{settings.trueWhenChars ? "Characters" : "Words"}
				</div>
			</ColoredPill>
		</>
	);
};

export default TextGrading;
