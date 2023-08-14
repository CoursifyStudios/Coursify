import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	SubmissionFileUpload,
	SubmissionLink,
} from "../../assignmentPanel/submission.types";
import { ColoredPill } from "@/components/misc/pill";
import { useState } from "react";
import { formatBytes } from "@/lib/misc/convertBytes";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const MediaGrading = ({
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
					<div key={content.fileName} className="grow group  ">
						<div className="relative">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={`https://cdn.coursify.one/storage/v1/object/public/ugc/submissions/${content.fileName}`}
								alt=""
								className="h-52 w-full object-cover rounded-t-xl"
							/>
							<a
								href={`https://cdn.coursify.one/storage/v1/object/public/ugc/submissions/${content.fileName}`}
								target="_blank"
								className="absolute inset-0 bg-backdrop/25 transition opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center"
							>
								<ArrowTopRightOnSquareIcon className="h-16 w-16 scale-75 group-hover:scale-100 transition" />
							</a>
						</div>
						<div className="bg-backdrop-200 rounded-b-xl px-4 py-2">
							<h3 className="font-medium line-clamp-2">{content.realName}</h3>
							<p className="text-sm">{formatBytes(content.size)}</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default MediaGrading;
