import {
	ChatBubbleBottomCenterTextIcon,
	DocumentArrowUpIcon,
	DocumentCheckIcon,
	DocumentTextIcon,
	FolderOpenIcon,
	LinkIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ReactNode } from "react";

import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import googleDrive from "/public/brand-logos/googledrive.svg";

const className = "h-5 w-5 min-w-[1.25rem] dark:brightness-90";

export const submissionType: {
	icon: ReactNode;
	name: string;
	description: string;
	type: AssignmentTypes;
	grayscale?: boolean;
}[] = [
	{
		icon: <LinkIcon className={className} />,
		name: "Link",
		description: "Submission for links",
		type: AssignmentTypes.LINK,
	},
	{
		icon: <PhotoIcon className={className} />,
		name: "Media Content",
		description: "Submission for images, videos, and gifs.",
		type: AssignmentTypes.MEDIA,
	},
	{
		icon: <DocumentArrowUpIcon className={className} />,
		name: "File Upload",
		description: "Submissions for any type of file",
		type: AssignmentTypes.FILE_UPLOAD,
	},
	{
		icon: <DocumentCheckIcon className={className} />,
		name: "Checkbox",
		description: "Checkoff, i.e. complete an assignment in a packet",
		type: AssignmentTypes.CHECKOFF,
	},
	{
		icon: <ChatBubbleBottomCenterTextIcon className={className} />,
		name: "Discussion Post",
		description: "Students can post discussions and reply to others",
		type: AssignmentTypes.DISCUSSION_POST,
	},
	// {
	// 	icon: <ClipboardDocumentListIcon className={className} />,
	// 	name: "Assessment",
	// 	description:
	// 		"Combine free responses and/or multiple choice questions for a test",
	// 	type: AssignmentTypes.ASSESSMENT,
	// },
	{
		icon: (
			<Image
				src={googleDrive}
				alt="Google Logo"
				width={24}
				height={24}
				className={className + " invert"}
			/>
		),
		name: "Google Media",
		description:
			"Submission box for Google products like docs, slides, sheets, etc.",
		type: AssignmentTypes.GOOGLE,
		grayscale: true,
	},
	{
		icon: <DocumentTextIcon className={className} />,
		name: "Text",
		description: "Submission for rich text content",
		type: AssignmentTypes.TEXT,
	},
	{
		icon: <FolderOpenIcon className={className} />,
		name: "Free Form",
		description: "Allows students to submit media, files, text, links, etc.",
		type: AssignmentTypes.ALL,
		grayscale: true,
	},
];
