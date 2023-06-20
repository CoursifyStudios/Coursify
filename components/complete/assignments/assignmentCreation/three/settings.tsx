import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";
import { AssignmentTypes } from "../../../../../lib/db/assignments";
import CheckBox from "./components/checkbox";
import Discussion from "./components/discussion";
import Link from "./components/link";
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
	}
};

export default GetAssignmentSettings;
