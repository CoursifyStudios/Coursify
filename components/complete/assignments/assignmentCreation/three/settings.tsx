import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";
import { AssignmentTypes } from "../../../../../lib/db/assignments";
import All from "./components/all";
import CheckBox from "./components/checkbox";
import Discussion from "./components/discussion";
import File from "./components/file";
import Link from "./components/link";
import Media from "./components/media";
import Text from "./components/text";
import { AssignmentSettingsTypes } from "./settings.types";

const GetAssignmentSettings: NextPage<{
	settings: AssignmentSettingsTypes | undefined;
	setSettings: Dispatch<SetStateAction<AssignmentSettingsTypes | undefined>>;
	assignmentType: AssignmentTypes;
}> = ({ assignmentType, settings, setSettings }) => {
	const imports = { settings, setSettings };
	switch (assignmentType) {
		case AssignmentTypes.LINK:
			//@ts-expect-error
			return <Link imports={imports} />;
		case AssignmentTypes.DISCUSSION_POST:
			//@ts-expect-error
			return <Discussion imports={imports} />;
		case AssignmentTypes.CHECKOFF:
			//@ts-expect-error
			return <CheckBox imports={imports} />;
		case AssignmentTypes.MEDIA:
			//@ts-expect-error
			return <Media imports={imports} />;
		case AssignmentTypes.TEXT:
			//@ts-expect-error
			return <Text imports={imports} />;
		case AssignmentTypes.FILE_UPLOAD:
			//@ts-expect-error
			return <File imports={imports} />;
		case AssignmentTypes.ALL:
			//@ts-expect-error
			return <All imports={imports} />;
		case AssignmentTypes.GOOGLE:
	}
};

export default GetAssignmentSettings;
