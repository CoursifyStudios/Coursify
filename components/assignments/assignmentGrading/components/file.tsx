import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionFileUpload,
	SubmissionLink,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useState } from "react";
import { formatBytes } from "@/lib/misc/convertBytes";
import {
	ArrowTopRightOnSquareIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";

const FileGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionFileUpload;
}) => {
	return (
		<>
			<div className="grid grid-cols-2 gap-4">
				{submission.files.map((content) => (
					<a
						className="bg-backdrop-200 rounded-xl px-4 py-2 w-full flex items-center brightness-hover"
						key={content.fileName}
						href={`https://cdn.coursify.one/storage/v1/object/public/ugc/submissions/${content.fileName}`}
						target="_blank"
					>
						<DocumentIcon className="w-6 h-6 mr-2" />
						<div>
							<h3 className="font-medium line-clamp-2">{content.realName}</h3>
							<p className="text-sm">{formatBytes(content.size)}</p>
						</div>
					</a>
				))}
			</div>
		</>
	);
};

export default FileGrading;
