import {
	DropdownSection,
	ToggleSection,
} from "@/components/settings/components/sections";
import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
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
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.DISCUSSION_POST
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.DISCUSSION_POST,
				trueWhenChars: true, //(and false when words are being counted)
				maxChars: undefined,
				minChars: undefined,
				mediaOnly: false,
				permissions: DiscussionPermissions.AFTER_POSTING,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (
		settings == undefined ||
		settings.assignmentType != AssignmentTypes.DISCUSSION_POST
	)
		return null;

	return (
		<>
			<DropdownSection
				name="Viewing Permissions"
				description="Choose when students can view other students' posts"
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
				name={`Limiting ${settings.trueWhenChars ? "Characters" : "Words"}`}
				description="Toggle between setting a character or a word limit. Leave the below fields blank for no word/character limit"
				enabled={settings.trueWhenChars}
				setEnabled={(value) =>
					setSettings((settings) => {
						return { ...settings, trueWhenChars: value };
					})
				}
			/>
			<div className="w-full flex gap-4">
				<label htmlFor="minChars" className="w-full flex grow flex-col">
					<span className="w-full flex text-sm font-medium">
						Minimum {settings.trueWhenChars ? "Characters" : "Words"}
						<Info className="w-full ml-2">
							The minimum number of characters allowed in a student
							{"'"}s response
						</Info>
					</span>
					<input
						type="number"
						className="w-full grow"
						name="minChars"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, minChars: parseInt(e.target.value) };
							})
						}
					/>
				</label>
				<label htmlFor="maxChars" className="w-full flex grow flex-col">
					<span className="w-full flex text-sm font-medium">
						Maximum {settings.trueWhenChars ? "Characters" : "Words"}
						<Info className="w-full ml-2">
							The maximum number of characters allowed in a student
							{"'"}s response
						</Info>
					</span>
					<input
						type="number"
						className="w-full grow"
						name="maxChars"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, maxChars: parseInt(e.target.value) };
							})
						}
					/>
				</label>
			</div>
			<details>
				<summary className="w-full cursor-pointer text-sm font-medium">
					Advanced Settings
				</summary>
				<ToggleSection
					name="Media Only"
					description="Only allow media submissions"
					enabled={settings.mediaOnly}
					setEnabled={(value) =>
						setSettings((settings) => {
							return { ...settings, mediaOnly: value };
						})
					}
				/>
			</details>
		</>
	);
};

export default Discussion;
