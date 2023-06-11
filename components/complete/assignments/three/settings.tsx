import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";
import { AssignmentTypes } from "../../../../lib/db/assignments";

const GetAssignmentSettings: NextPage<{
	settings: JSON;
	setSettings: Dispatch<SetStateAction<JSON>>;
	assignmentType: AssignmentTypes;
}> = ({ assignmentType, settings, setSettings }) => {
	const imports = { settings, setSettings };
	switch (assignmentType) {
		case AssignmentTypes.LINK:
			return <Link imports={imports} />;
	}
};

export default GetAssignmentSettings;

const Link = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: JSON;
		setSettings: Dispatch<SetStateAction<JSON>>;
	};
}) => {
	return (
		<>
			<input
				type="number"
				onChange={(e) =>
					setSettings((settings) => {
						return { ...settings };
					})
				}
			/>
		</>
	);
};
