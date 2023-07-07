import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { Database } from "@/lib/db/database.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import { AssignmentSettingsTypes } from "../assignmentCreation/three/settings.types";
import CheckBox from "./components/checkbox";
import { Submission, SubmissionSettingsTypes } from "./submission.types";

const AssignmentPanel: NextPage<{
	assignmentType: AssignmentTypes;
	settings: AssignmentSettingsTypes;
	setRevisions: Dispatch<SetStateAction<Submission[]>>;
	revisions: Submission[];
	assignmentID: string;
}> = ({ assignmentType, setRevisions, revisions, settings, assignmentID }) => {
	const [submission, setSubmission] = useState<SubmissionSettingsTypes>();
	const supabase = useSupabaseClient<Database>();
	const user = useUser();
	const imports = {
		settings,
		setRevisions,
		submission,
		setSubmission,
		assignmentID,
		supabase,
		user,
		revisions,
	};

	switch (assignmentType) {
		case AssignmentTypes.CHECKOFF:
			// @ts-expect-error Type conversion
			return <CheckBox imports={imports} />;
	}
};

export default AssignmentPanel;