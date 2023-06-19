import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";
import { AssignmentTypes } from "../../../../../lib/db/assignments";
import Link from "./components/link";
import { AssignmentSettingsTypes } from "./settings.types";

const GetAssignmentSettings: NextPage<{
	settings: AssignmentSettingsTypes;
	setSettings: Dispatch<SetStateAction<AssignmentSettingsTypes>>;
	assignmentType: AssignmentTypes;
}> = ({ assignmentType, settings, setSettings }) => {
	const imports = { settings, setSettings };
	switch (assignmentType) {
		case AssignmentTypes.LINK:
			//@ts-expect-error
			return <Link imports={imports} />;
	}
};

export default GetAssignmentSettings;
