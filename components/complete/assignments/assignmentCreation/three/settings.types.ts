import { AssignmentTypes } from "../../../../../lib/db/assignments";

export interface AssignmentLink {
	urls: undefined | string[];
	maxUrls: number;
	assignmentType: AssignmentTypes.LINK;
	enforceHttps: boolean;
}

export interface AssignmentMedia {
	assignmentType: AssignmentTypes.MEDIA;
	fileTypes: string[];
	maxSize: number;
	minFiles: number;
	maxFiles: number | undefined;
}

export interface AssignmentFileUpload {
	assignmentType: AssignmentTypes.FILE_UPLOAD;
	fileTypes: string[] | undefined;
	maxSize: number;
	minFiles: number;
	maxFiles: number | undefined;
}

export interface AssignmentCheckoff {
	assignmentType: AssignmentTypes.CHECKOFF;
	checkboxes: { name: string; description: string } | undefined;
}

export interface AssignmentDiscussionPost {
	assignmentType: AssignmentTypes.DISCUSSION_POST;
	minChars: number | undefined;
	maxChars: number | undefined;
	permissions: DiscussionPermissions;
	mediaOnly: boolean;
}

export interface AssignmentGoogle {
	assignmentType: AssignmentTypes.GOOGLE;
	services: string[];
}

export interface AssignmentText {
	assignmentType: AssignmentTypes.TEXT;
	rich: boolean;
	minChars: number | undefined;
	maxChars: number | undefined;
}

export interface AssignmentAll {
	assignmentType: AssignmentTypes.ALL;
	allowedTypes:
		| (
				| AssignmentTypes.LINK
				| AssignmentTypes.GOOGLE
				| AssignmentTypes.MEDIA
				| AssignmentTypes.TEXT
				| AssignmentTypes.MEDIA
		  )[]
		| undefined;
}

export type AssignmentSettingsTypes =
	| AssignmentLink
	| AssignmentMedia
	| AssignmentFileUpload
	| AssignmentCheckoff
	| AssignmentDiscussionPost
	| AssignmentGoogle
	| AssignmentText
	| AssignmentAll
	| undefined;

export enum DiscussionPermissions {
	NEVER = 0,
	AFTER_POSTING = 1,
	ALWAYS = 2,
}
