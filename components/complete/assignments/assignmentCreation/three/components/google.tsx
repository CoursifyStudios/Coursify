import { AssignmentTypes } from "@/lib/db/assignments";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { AssignmentGoogle } from "../settings.types";

const Google = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentGoogle;
		setSettings: Dispatch<SetStateAction<AssignmentGoogle>>;
	};
}) => {
	useLayoutEffect(() => {
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.GOOGLE
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.GOOGLE,
				services: [], //figured it out. we need to load this with all of the google services
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (
		settings == undefined ||
		settings.assignmentType != AssignmentTypes.GOOGLE
	)
		return null;

	return <></>;
};

export default Google;
