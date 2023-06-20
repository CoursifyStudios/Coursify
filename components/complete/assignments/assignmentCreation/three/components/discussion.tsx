import {
	DropdownSection,
	ToggleSection,
} from "@/components/settings/components/sections";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { AssignmentTypes } from "../../../../../../lib/db/assignments";
import { Info } from "../../../../../tooltips/info";
import {
	AssignmentDiscussionPost,
	DiscussionPermissions,
} from "../settings.types";

const Discussion = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentDiscussionPost;
		setSettings: Dispatch<SetStateAction<AssignmentDiscussionPost>>;
	};
}) => {
	useLayoutEffect(() => {
		if (settings == undefined)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.DISCUSSION_POST,
				maxChars: undefined,
				minChars: undefined,
				mediaOnly: false,
				permissions: DiscussionPermissions.AFTER_POSTING,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (settings == undefined) return null;

	return (
		<>
			<label htmlFor="minChars" className="flex grow flex-col">
				<span className="flex text-sm font-medium">
					Minimum Characters
					<Info className="ml-2">
						The minimum characters a student is allowed to submit
					</Info>
				</span>
				<input
					type="number"
					className="w-64"
					name="minChars"
					onChange={(e) =>
						setSettings((settings) => {
							return { ...settings, minChars: parseInt(e.target.value) };
						})
					}
				/>
			</label>
			<label htmlFor="maxChars" className="flex grow flex-col">
				<span className="flex text-sm font-medium">
					Maximum Characters
					<Info className="ml-2">
						The maximum characters a student is allowed to submit
					</Info>
				</span>
				<input
					type="number"
					className="w-64"
					name="maxChars"
					onChange={(e) =>
						setSettings((settings) => {
							return { ...settings, maxChars: parseInt(e.target.value) };
						})
					}
				/>
			</label>
			<DropdownSection
				name="Veiwing Permissions"
				description="When students can view other students' posts"
				values={[
					{ name: "After posting", id: DiscussionPermissions.AFTER_POSTING },
					{ name: "Always", id: DiscussionPermissions.ALWAYS },
					{ name: "Never", id: DiscussionPermissions.NEVER },
				]}
				currentValue={settings.permissions}
				type={1}
				onChange={(value) =>
					setSettings((settings) => {
						return { ...settings, permissions: value.id };
					})
				}
			/>

			<ToggleSection
				name="Media Only"
				description="Media Only"
				enabled={settings.mediaOnly}
				setEnabled={(value) =>
					setSettings((settings) => {
						return { ...settings, mediaOnly: value };
					})
				}
			/>
		</>
	);
};

export default Discussion;
