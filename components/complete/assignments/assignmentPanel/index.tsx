import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { NextPage } from "next";
import CheckBox from "./checkbox";

const AssignmentPanel: NextPage<{
	assignmentType: AssignmentTypes;
	revisions: never[];
}> = ({ assignmentType }) => {
	switch (assignmentType) {
		case AssignmentTypes.CHECKOFF:
			return <CheckBox />;
	}
};

export default AssignmentPanel;
