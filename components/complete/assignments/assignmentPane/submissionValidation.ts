import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import * as Yup from "yup";
import { SubmissionSettingsTypes } from "./submission.types";

const submissionValidation = (object: SubmissionSettingsTypes) => {
	switch (object.assignmentType) {
		case AssignmentTypes.LINK:
			return submissionLinkValidation.validateSync(object);
		case AssignmentTypes.MEDIA:
			return submissionMediaValidation.validateSync(object);
		case AssignmentTypes.FILE_UPLOAD:
			return submissionFileUploadValidation.validateSync(object);
		case AssignmentTypes.CHECKOFF:
			return submissionCheckoffValidation.validateSync(object);
		case AssignmentTypes.DISCUSSION_POST:
			return submissionDiscussionPostValidation.validateSync(object);
		case AssignmentTypes.GOOGLE:
			return submissionGoogleValidation.validateSync(object);
		case AssignmentTypes.TEXT:
			return submissionTextValidation.validateSync(object);
		case AssignmentTypes.ALL:
			return submissionAllValidation.validateSync(object);
	}
};

export default submissionValidation;

export const submissionLinkValidation = Yup.object({
	links: Yup.array().of(Yup.string().required()),
});

export const submissionMediaValidation = Yup.object({
	media: Yup.array().of(
		Yup.object({
			link: Yup.string().required(),
			caption: Yup.string().optional(),
		})
	),
});

export const submissionFileUploadValidation = Yup.object({
	files: Yup.array().of(
		Yup.object({
			link: Yup.string().required(),
			caption: Yup.string().optional(),
		})
	),
});

export const submissionCheckoffValidation = Yup.object({
	boxes: Yup.array().of(Yup.number().required()),
});

export const submissionDiscussionPostValidation = Yup.mixed().oneOf([
	{
		text: Yup.string().required(),
		media: false,
	},
	{
		richText: Yup.string().required(),
		media: false,
	},
	{
		media: true,
		link: Yup.string().required(),
		caption: Yup.string().optional(),
	},
]);

export const submissionGoogleValidation = Yup.object({
	jsonContent: Yup.string().required(),
});

export const submissionTextValidation = Yup.mixed().oneOf([
	{
		text: Yup.string().required(),
	},
	{
		richText: Yup.object().required(),
	},
]);

export const submissionAllValidation = Yup.object({
	jsonContent: Yup.array().of(
		Yup.object({
			type: Yup.string().required(),
			content: Yup.mixed().oneOf([
				{
					text: Yup.string().required(),
				},
				{
					richText: Yup.string().required(),
				},
				{
					link: Yup.string().required(),
				},
				{
					media: Yup.object().required(),
				},
				{
					fileUpload: Yup.object().required(),
				},
				{
					checkoff: Yup.array().of(Yup.number().required()),
				},
			]),
		})
	),
});
