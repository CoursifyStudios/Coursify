import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { SubmissionLink } from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useState } from "react";

const LinkGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionLink;
}) => {
	const [selectedLink, setSelectedLink] = useState(0);

	return (
		<>
			<div className="flex flex-wrap mb-2 gap-2">
				{submission.links.map((link, i) => (
					<div onClick={() => setSelectedLink(i)} key={i}>
						<ColoredPill
							className={` brightness-hover ${
								i == selectedLink ? "brightness-focus" : "!bg-gray-200"
							} cursor-pointer`}
							hoverState
						>
							{link}
						</ColoredPill>
					</div>
				))}
			</div>
			<div className="px-4 py-2 bg-backdrop-200 rounded-t-xl flex">
				<p className="font-medium mr-2">Link: </p>
				<span className="truncate max-w-sm">
					{submission.links[selectedLink]}
				</span>
				<a
					href={submission.links[selectedLink]}
					className="ml-auto"
					target="_blank"
				>
					<ColoredPill color={`gray`} hoverState>
						Open Link
					</ColoredPill>
				</a>
			</div>
			<div className="relative w-full">
				<iframe
					src={submission.links[selectedLink]}
					allow="fullscreen"
					className="h-96 rounded-b-xl bg-backdrop-200 w-full"
				/>

				<ColoredPill className="absolute bottom-5 right-5 z-10" color="yellow">
					Some websites don{"'"}t allow previews
				</ColoredPill>
			</div>
		</>
	);
};

export default LinkGrading;
