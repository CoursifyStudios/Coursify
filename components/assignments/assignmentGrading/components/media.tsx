/* eslint-disable @next/next/no-img-element */
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
	ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { Popup } from "@/components/misc/popup";
import { ArrayElementType } from "@/lib/misc/elementarraytype.types";

const MediaGrading = ({
	assignmentData,
	submission,
}: {
	assignmentData: TeacherAssignmentResponse;
	submission: SubmissionFileUpload;
}) => {
	return (
		<>
			<div
				className={`grid ${submission.files.length > 1 && "grid-cols-2"} gap-4`}
			>
				{submission.files.map((media) => (
					<Media
						media={media}
						key={media.realName}
						tall={submission.files.length > 1}
					/>
				))}
			</div>
		</>
	);
};

export function Media({
	media,
	tall,
}: {
	media: ArrayElementType<SubmissionFileUpload["files"]>;
	tall: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<div
				key={media.fileName}
				className="grow group brightness-hover rounded-xl"
			>
				<div className="relative">
					<img
						src={
							media.link ??
							`https://cdn.coursify.one/storage/v1/object/public/ugc/submissions/${media.fileName}`
						}
						alt=""
						className={`${
							!tall ? "h-52" : "h-96"
						} w-full object-cover rounded-t-xl`}
					/>
					<div
						onClick={() => setOpen(true)}
						className="absolute inset-0 bg-backdrop/25 transition opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center"
					>
						<ArrowsPointingOutIcon className="h-16 w-16 scale-75 group-hover:scale-100 transition" />
					</div>
				</div>
				<div className="bg-backdrop-200 rounded-b-xl px-4 py-2">
					<h3 className="font-medium line-clamp-2">{media.realName}</h3>
					<p className="text-sm">{formatBytes(media.size)}</p>
				</div>
			</div>
			<Popup open={open} closeMenu={() => setOpen(false)}>
				<div className="relative">
					<img
						src={
							media.link ??
							`https://cdn.coursify.one/storage/v1/object/public/ugc/submissions/${media.fileName}`
						}
						alt=""
						className={`
					max-h-[90vh] w-full object-cover rounded-xl`}
					/>
					<a
						href={
							media.link ??
							`https://cdn.coursify.one/storage/v1/object/public/ugc/submissions/${media.fileName}`
						}
						target="_blank"
					>
						<ColoredPill
							className="absolute top-3 left-3 !bg-opacity-60"
							color="gray"
						>
							Open in new tab
						</ColoredPill>
					</a>
				</div>
			</Popup>
		</>
	);
}

export default MediaGrading;
