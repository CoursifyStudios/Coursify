import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { NextPage } from "next";
import { useState } from "react";
import { AssignmentSettingsTypes } from "../assignmentCreation/three/settings.types";
import CheckBox from "./components/checkbox";
import { SubmissionSettingsTypes } from "./submission.types";

const AssignmentPanel: NextPage<{
	assignmentType: AssignmentTypes;
	settings: AssignmentSettingsTypes;
	revisions: SubmissionSettingsTypes[];
}> = ({ assignmentType, revisions, settings }) => {
	const [submission, setSubmission] = useState<SubmissionSettingsTypes>();
	const imports = { settings, revisions, submission, setSubmission };
	switch (assignmentType) {
		case AssignmentTypes.CHECKOFF:
			// @ts-expect-error Type conversion
			return <CheckBox imports={imports} />;
	}
};

export default AssignmentPanel;
