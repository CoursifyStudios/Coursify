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
	const [loadedFiles, setLoadedFiles] = useState<string[]>([]);

	return (
		<>
			<div className="grid grid-cols-2 gap-4">
				{submission.files.map((file) =>
					file.realName.toLowerCase().endsWith(".pdf") ? (
						<div
							key={file.fileName}
							className="relative col-span-2 rounded-xl overflow-hidden"
						>
							<div className=" bg-gray-800 absolute inset z-10" />
							<iframe
								src={file.link}
								className="h-96 w-full bg-backdrop-200 "
								onLoad={() => {
									setLoadedFiles((loadedFiles) => [
										...loadedFiles,
										file.fileName,
									]);
								}}
							/>
						</div>
					) : (
						<a
							className="bg-backdrop-200 rounded-xl px-4 py-2 w-full flex items-center brightness-hover"
							key={file.fileName}
							href={file.link}
							target="_blank"
						>
							<DocumentIcon className="w-6 h-6 mr-2" />
							<div>
								<h3 className="font-medium line-clamp-2">{file.realName}</h3>
								<p className="text-sm">{formatBytes(file.size)}</p>
							</div>
						</a>
					)
				)}
			</div>
		</>
	);
};

export default FileGrading;
