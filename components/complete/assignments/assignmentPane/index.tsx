import { AssignmentTypes } from "@/lib/db/assignments";
import { NextPage } from "next";
import CheckBox from "./checkbox";

const AssignmentPane: NextPage<{ assignmentType: AssignmentTypes }> = ({
	assignmentType,
}) => {
	switch (assignmentType) {
		case AssignmentTypes.CHECKOFF:
			return <CheckBox />;
	}
};

export default AssignmentPane;
