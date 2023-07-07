import { ToggleSection } from "@/components/settings/components/sections";
import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { AssignmentText } from "../settings.types";

const Text = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentText;
		setSettings: Dispatch<SetStateAction<AssignmentText>>;
	};
}) => {
	useLayoutEffect(() => {
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.TEXT
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.TEXT,
				rich: true,
				trueWhenChars: true, //(and false when words are being counted)
				maxChars: undefined,
				minChars: undefined,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (settings == undefined || settings.assignmentType != AssignmentTypes.TEXT)
		return null;

	return (
		<>
			<ToggleSection
				name={`Limiting ${settings.trueWhenChars ? "Characters" : "Words"}`}
				description="Toggle between setting a character or a word limit"
				enabled={settings.trueWhenChars}
				setEnabled={(value) =>
					setSettings((settings) => {
						return { ...settings, trueWhenChars: value };
					})
				}
			/>
			<div className="flex gap-4">
				<label htmlFor="minChars" className="flex grow flex-col">
					<span className="flex text-sm font-medium">
						Minimum {settings.trueWhenChars ? "Characters" : "Words"}
						<Info className="ml-2">
							The minimum number of characters allowed in a student
							{"'"}s response
						</Info>
					</span>
					<input
						type="number"
						className="grow"
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
						Maximum {settings.trueWhenChars ? "Characters" : "Words"}
						<Info className="ml-2">
							The maximum number of characters a student allowed in a student
							{"'"}s response
						</Info>
					</span>
					<input
						type="number"
						className="grow"
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
				<summary className="cursor-pointer text-sm font-medium">
					Advanced Settings
				</summary>
				<ToggleSection
					name="Rich text"
					description="Aloow students to submit rich text; i.e. bolded or underlined text"
					enabled={settings.rich}
					setEnabled={(value) =>
						setSettings((settings) => {
							return { ...settings, rich: value };
						})
					}
				/>
			</details>
		</>
	);
};

export default Text;
