import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import * as Yup from "yup";
import {
	assignmentCheckoffValidation,
	assignmentDiscussionPostValidation,
	assignmentFileUploadValidation,
	assignmentGoogleValidation,
	assignmentLinkValidation,
	assignmentMediaValidation,
	assignmentTextValidation,
} from "./settingsValidation";

export interface AssignmentLink
	extends Yup.InferType<typeof assignmentLinkValidation> {
	assignmentType: AssignmentTypes.LINK;
}

export interface AssignmentMedia
	extends Yup.InferType<typeof assignmentMediaValidation> {
	assignmentType: AssignmentTypes.MEDIA;
}

export interface AssignmentFileUpload
	extends Yup.InferType<typeof assignmentFileUploadValidation> {
	assignmentType: AssignmentTypes.FILE_UPLOAD;
}

export interface AssignmentCheckoff
	extends Yup.InferType<typeof assignmentCheckoffValidation> {
	assignmentType: AssignmentTypes.CHECKOFF;
}

export interface AssignmentDiscussionPost
	extends Yup.InferType<typeof assignmentDiscussionPostValidation> {
	assignmentType: AssignmentTypes.DISCUSSION_POST;
	permissions: DiscussionPermissions;
}

export interface AssignmentGoogle
	extends Yup.InferType<typeof assignmentGoogleValidation> {
	assignmentType: AssignmentTypes.GOOGLE;
	service: GoogleSubmissionTypes;
}

export interface AssignmentText
	extends Yup.InferType<typeof assignmentTextValidation> {
	assignmentType: AssignmentTypes.TEXT;
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
				| AssignmentTypes.FILE_UPLOAD
		  )[];
}

export type AssignmentSettingsTypes =
	| AssignmentLink
	| AssignmentMedia
	| AssignmentFileUpload
	| AssignmentCheckoff
	| AssignmentDiscussionPost
	| AssignmentGoogle
	| AssignmentText
	| AssignmentAll;

export enum DiscussionPermissions {
	NEVER = 0,
	AFTER_POSTING = 1,
	ALWAYS = 2,
}

export enum GoogleSubmissionTypes {
	DOCS = 0,
	SLIDES = 1,
	SHEETS = 2,
	FORMS = 3,
	DRIVE = 4,
	PHOTOS = 5,
}
