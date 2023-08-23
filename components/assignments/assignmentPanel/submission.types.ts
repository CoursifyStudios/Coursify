import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { SerializedEditorState } from "lexical";
import * as Yup from "yup";
import { GoogleSubmissionTypes } from "../assignmentCreation/three/settings.types";
import {
	submissionCheckoffValidation,
	submissionFileUploadValidation,
	submissionGoogleValidation,
	submissionLinkValidation,
	submissionMediaValidation,
} from "./submissionValidation";

export interface SubmissionLink
	extends Yup.InferType<typeof submissionLinkValidation> {
	assignmentType: AssignmentTypes.LINK;
}

export interface SubmissionMedia
	extends Yup.InferType<typeof submissionMediaValidation> {
	assignmentType: AssignmentTypes.MEDIA;
}

export interface SubmissionFileUpload
	extends Yup.InferType<typeof submissionFileUploadValidation> {
	assignmentType: AssignmentTypes.FILE_UPLOAD;
}

export interface SubmissionCheckoff
	extends Yup.InferType<typeof submissionCheckoffValidation> {
	assignmentType: AssignmentTypes.CHECKOFF;
}

export type SubmissionDiscussionPost = {
	richText: SerializedEditorState;
	media: false;
	assignmentType: AssignmentTypes.DISCUSSION_POST;
};

export interface SubmissionGoogle
	extends Yup.InferType<typeof submissionGoogleValidation> {
	assignmentType: AssignmentTypes.GOOGLE;
	service: GoogleSubmissionTypes;
}

export type SubmissionText =
	| { assignmentType: AssignmentTypes.TEXT; content: string }
	| { assignmentType: AssignmentTypes.TEXT; content: SerializedEditorState };

export interface SubmissionAll {
	assignmentType: AssignmentTypes.ALL;
	allowedTypes:
		| AssignmentTypes.LINK
		| AssignmentTypes.GOOGLE
		| AssignmentTypes.MEDIA
		| AssignmentTypes.TEXT
		| AssignmentTypes.FILE_UPLOAD;
}

export type SubmissionSettingsTypes =
	| SubmissionLink
	| SubmissionMedia
	| SubmissionFileUpload
	| SubmissionCheckoff
	| SubmissionDiscussionPost
	| SubmissionGoogle
	| SubmissionText
	| SubmissionAll;

export interface Submission {
	content: SubmissionSettingsTypes;
	final: boolean;
	created_at: string;
	grade: number | null;
	comment: string | null;
	users?: {
		id: string;
		full_name: string;
		avatar_url: string;
	};
}
