import { NextPage } from "next";
import { Dispatch, SetStateAction, useEffect } from "react";
import { AssignmentTypes } from "../../../../../lib/db/assignments";
import { AssignmentLink, AssignmentSettingsTypes } from "./settings.types";

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

const Link = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentLink;
		setSettings: Dispatch<SetStateAction<AssignmentLink>>;
	};
}) => {
	useEffect(() => {
		setSettings((settings) => {
			if (settings == undefined)
				return {
					assignmentType: AssignmentTypes.LINK,
					maxUrls: 1,
					urls: [],
				};
			else return settings;
		});
	});

	return (
		<>
			<input
				type="number"
				defaultValue={1}
				onChange={(e) =>
					setSettings((settings) => {
						return { ...settings, maxUrls: parseInt(e.target.value) };
					})
				}
			/>
			{JSON.stringify(settings)}
		</>
	);
};
