import { NextPage } from "next";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { AssignmentTypes } from "../../../../../lib/db/assignments";
import { ToggleSection } from "../../../../settings/components/sections";
import { Info } from "../../../../tooltips/info";
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
	useLayoutEffect(() => {
		if (settings == undefined)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.LINK,
				maxUrls: 1,
				urls: [],
				enforceHttps: true,
			});
	}, []);

	if (settings == undefined) return null;

	return (
		<>
			<label htmlFor="maxUrls" className="flex grow flex-col">
				<span className="flex text-sm font-medium">
					Max Links Allowed<span className="text-red-600">*</span>
					<Info className="ml-2">
						The maximum number of links a student is allowed to submit
					</Info>
				</span>
				<input
					type="number"
					defaultValue={settings.maxUrls}
					className="w-64"
					name="maxUrls"
					onChange={(e) =>
						setSettings((settings) => {
							return { ...settings, maxUrls: parseInt(e.target.value) };
						})
					}
				/>
			</label>
			<label htmlFor="maxUrls" className="flex grow flex-col">
				<span className="flex text-sm font-medium">
					Link Allow List<span className="text-red-600">*</span>
					<Info className="ml-2">
						Specify certain TLDs (the first part of a URL, like like google.com
						or https://www.loc.gov) that students can submit like google.com or
						https://www.loc.gov. By default, students can submit links from any
						TLD.
					</Info>
				</span>
				<textarea
					name="allowList"
					className="h-24 resize-none placeholder:italic"
					placeholder="Leave this field blank to allow all links"
					cols={3}
				>
					<div className="h-5 w-10 bg-red-500"></div>
				</textarea>
				<ToggleSection
					name="Enforce https"
					description="Require all links to use a secure protocol (https)"
					enabled={settings.enforceHttps}
					setEnabled={(value) =>
						setSettings((settings) => {
							return { ...settings, enforceHttps: value };
						})
					}
				/>
			</label>
			{JSON.stringify(settings)}
		</>
	);
};
