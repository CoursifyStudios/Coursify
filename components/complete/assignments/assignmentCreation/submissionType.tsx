import {
	ChatBubbleBottomCenterTextIcon,
	ClipboardDocumentListIcon,
	DocumentCheckIcon,
	DocumentTextIcon,
	FolderOpenIcon,
	LinkIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ReactNode } from "react";
import { AssignmentTypes } from "../../../../lib/db/assignments";
import googleDrive from "/public/brand-logos/googledrive.svg";

const className = "h-5 w-5 min-w-[1.25rem] dark:brightness-90";

export const submissionType: {
	icon: ReactNode;
	name: string;
	description: string;
	type: AssignmentTypes;
}[] = [
	{
		icon: <LinkIcon className={className} />,
		name: "Link",
		description: "Submission for links",
		type: AssignmentTypes.LINK,
	},
	{
		icon: <PhotoIcon className={className} />,
		name: "Rich Media",
		description: "Submission for images, videos, etc.",
		type: AssignmentTypes.MEDIA,
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
	{
		icon: <ClipboardDocumentListIcon className={className} />,
		name: "Assessment",
		description:
			"Combine free responses and/or multiple choice questions for a test",
		type: AssignmentTypes.ASSESSMENT,
	},
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
	},
	{
		icon: <DocumentTextIcon className={className} />,
		name: "Text",
		description: "Submission for rich text content",
		type: AssignmentTypes.TEXT,
	},
	{
		icon: <FolderOpenIcon className={className} />,
		name: "Free form",
		description: "Allows students to submit media, text, links, etc.",
		type: AssignmentTypes.ALL,
	},
];
