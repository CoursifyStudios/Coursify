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
		case AssignmentTypes.ALL:
			return assignmentAllValidation.validateSync(object);
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
	maxSize: Yup.number().min(1).max(20).required(),
	minFiles: Yup.number().min(1).required(),
	maxFiles: Yup.number(),
});

export const assignmentFileUploadValidation = Yup.object({
	fileTypes: Yup.array().of(Yup.string().required()),
	maxSize: Yup.number().min(1).max(100).required(),
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
	// copyFrom: Yup.string().required().test(
	// 	(value, ctx) => {
	// 		googleTypes.find((v) => Yup.id == value)?.regex!
	// 		return true
	// 	}
	// ),
	service: Yup.number().required(),
});

export const googleTypes = [
	{ name: "Docs", id: 0, regex: /^https?:\/\/docs\.google\.com\/.+$/ },
	{
		name: "Slides",
		id: 1,
		regex: /^https?:\/\/docs\.google\.com\/presentation\/.+$/,
	},
	{
		name: "Sheets",
		id: 2,
		regex: /^https?:\/\/docs\.google\.com\/spreadsheets\/.+$/,
	},
	{ name: "Forms", id: 3, regex: /^https?:\/\/docs\.google\.com\/forms\/.+$/ },
	{ name: "Drive", id: 4, regex: /^https?:\/\/drive\.google\.com\/.+$/ },
	{ name: "Photos", id: 5, regex: /^https?:\/\/photos\.google\.com\/.+$/ },
];

export const assignmentTextValidation = Yup.object({
	trueWhenChars: Yup.boolean().required(),
	rich: Yup.boolean().required(),
	minChars: Yup.number(),
	maxChars: Yup.number(),
});

export const assignmentAllValidation = Yup.object({
	allowedTypes: Yup.array().of(Yup.number().required()).min(1).required(),
});
