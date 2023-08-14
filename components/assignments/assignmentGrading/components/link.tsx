import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { SubmissionLink } from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";

const LinkGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionLink;
}) => {
	return (
		<>
			<div className="flex flex-wrap mb-2 gap-2">
				{submission.links.map((link, i) => (
					<ColoredPill key={i} color={`gray`} hoverState>
						{link}
					</ColoredPill>
				))}
			</div>
			<div className="px-4 py-2 bg-backdrop-200 rounded-t-xl flex">
				<p className="font-medium mr-2">Link: </p>
				<span className="truncate max-w-sm">{submission.links}</span>
			</div>
		</>
	);
};

export default LinkGrading;
