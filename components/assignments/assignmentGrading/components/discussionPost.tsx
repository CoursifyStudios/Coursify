import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionDiscussionPost,
	SubmissionLink,
	SubmissionText,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { SelectedStudent } from ".";
import { AssignmentDiscussionPost } from "../../assignmentCreation/three/settings.types";

const Editor = dynamic(() => import("@/components/editors/richeditor"));

const DiscussionGrading = ({
	assignmentData,
	submission,
	selectedStudent,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionDiscussionPost;
	selectedStudent: SelectedStudent;
}) => {
	const allPosts = selectedStudent.submissions.filter((s) => s.final);
	const settings = assignmentData.data
		?.settings as unknown as AssignmentDiscussionPost;

	const textLength = (text: string) => {
		if (settings.trueWhenChars) return text.length;
		else return (text.match(/\S+/g) || []).length;
	};

	if (allPosts.length == 0)
		return (
			<div className="text-center font-medium my-2">
				Viewing drafts and revisions is coming soon.
			</div>
		);

	return allPosts.map((post) => {
		const text = (post.content as unknown as SubmissionText).content;
		return (
			<Fragment key={post.id}>
				<div className="p-4 bg-backdrop-200 rounded-xl flex mb-2">
					<Editor
						editable={false}
						initialState={text}
						className=" "
						//updateRaw={setText}
					/>
				</div>
				{/* <ColoredPill color="gray" className="ml-auto mb-4 mt-2">
			chars
			{/* {textLength}
					{settings.maxChars && ` / ${settings.maxChars}`}{" "}
					{settings.trueWhenChars ? "Characters" : "Words"} *}
			</ColoredPill> */}
			</Fragment>
		);
	});
};

export default DiscussionGrading;
