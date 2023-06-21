import { AssignmentTypes } from "@/lib/db/assignments";
import * as Yup from "yup";
import { AssignmentSettingsTypes } from "./settings.types";

const assignmentValidation = (object: AssignmentSettingsTypes) => {
	switch (object.assignmentType) {
		case AssignmentTypes.LINK:
			return assignmentLinkValidation.validateSync(object);
		case AssignmentTypes.MEDIA:
			return assignmentMediaValidation.validateSync(object);
		case AssignmentTypes.FILE_UPLOAD:
			return assignmentFileUploadValidation.validateSync(object);
		case AssignmentTypes.CHECKOFF:
			return assignmentCheckoffValidation.validateSync(object);
		case AssignmentTypes.DISCUSSION_POST:
			return assignmentDiscussionPostValidation.validateSync(object);
		case AssignmentTypes.GOOGLE:
			return assignmentGoogleValidation.validateSync(object);
		case AssignmentTypes.TEXT:
			return assignmentTextValidation.validateSync(object);
		default:
			throw new Error(`Unknown assignment type: ${object.assignmentType}`);
	}
};

export default assignmentValidation;

export const assignmentLinkValidation = Yup.object({
	urls: Yup.array().of(Yup.string().required()),
	maxUrls: Yup.number().min(1).required(),
	enforceHttps: Yup.boolean().required(),
});

export const assignmentMediaValidation = Yup.object({
	fileTypes: Yup.array().of(Yup.string().required()).required(),
	maxSize: Yup.number().min(1).required(),
	minFiles: Yup.number().min(1).required(),
	maxFiles: Yup.number(),
});

export const assignmentFileUploadValidation = Yup.object({
	fileTypes: Yup.array().of(Yup.string().required()),
	maxSize: Yup.number().min(1).required(),
	minFiles: Yup.number().min(1).required(),
	maxFiles: Yup.number(),
});

export const assignmentCheckoffValidation = Yup.object({
	checkboxes: Yup.array()
		.of(
			Yup.object({
				name: Yup.string().required(),
				description: Yup.string().required(),
				step: Yup.number().required(),
				teacher: Yup.boolean().required(),
			})
		)
		.required(),
});

export const assignmentDiscussionPostValidation = Yup.object({
	trueWhenChars: Yup.boolean().required(),
	minChars: Yup.number(),
	maxChars: Yup.number(),
	permissions: Yup.number().required(),
	mediaOnly: Yup.boolean().required(),
});

export const assignmentGoogleValidation = Yup.object({
	services: Yup.array().of(Yup.string().required()).required(),
});

export const assignmentTextValidation = Yup.object({
	trueWhenChars: Yup.boolean().required(),
	rich: Yup.boolean().required(),
	minChars: Yup.number(),
	maxChars: Yup.number(),
});

export const assignmentAllValidation = Yup.object({
	allowedTypes: Yup.array().of(Yup.number().required()).required(),
});
