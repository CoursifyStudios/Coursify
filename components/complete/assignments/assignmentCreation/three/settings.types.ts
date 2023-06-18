import { AssignmentTypes } from "../../../../../lib/db/assignments";

export type AssignmentSettingsTypes =
	| {
			urls: undefined | string[];
			maxUrls: number;
			assignmentType: AssignmentTypes.LINK;
	  }
	| {
			assignmentType: AssignmentTypes.MEDIA;
			fileTypes: string[];
			maxSize: number;
			minFiles: number;
			maxFiles: number | undefined;
	  }
	| {
			assignmentType: AssignmentTypes.FILE_UPLOAD;
			fileTypes: string[] | undefined;
			maxSize: number;
			minFiles: number;
			maxFiles: number | undefined;
	  }
	| {
			assignmentType: AssignmentTypes.CHECKOFF;
			checkboxes: { name: string; description: string } | undefined;
	  }
	| {
			assignmentType: AssignmentTypes.DISCUSSION_POST;
			minChars: number | undefined;
			maxChars: number | undefined;
			permissions: DiscussionPermissions;
			mediaOnly: boolean;
	  }
	| {
			assignmentType: AssignmentTypes.GOOGLE;
			services: string[];
	  }
	| {
			assignmentType: AssignmentTypes.TEXT;
			rich: boolean;
			minChars: number | undefined;
			maxChars: number | undefined;
	  }
	| {
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
	  };

export enum DiscussionPermissions {
	NEVER = 0,
	AFTER_POSTING = 1,
	ALWAYS = 2,
}
