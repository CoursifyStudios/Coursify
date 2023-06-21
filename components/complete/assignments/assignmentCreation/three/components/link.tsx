import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import TagsInput from "react-tagsinput";
import { AssignmentTypes } from "../../../../../../lib/db/assignments";
import { normalizeURLs } from "../../../../../../lib/misc/normalizeurls";
import { ToggleSection } from "../../../../../settings/components/sections";
import { Info } from "../../../../../tooltips/info";
import { AssignmentLink } from "../settings.types";

const Link = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentLink;
		setSettings: Dispatch<SetStateAction<AssignmentLink>>;
	};
}) => {
	useLayoutEffect(() => {
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.LINK
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.LINK,
				maxUrls: 1,
				urls: [],
				enforceHttps: false,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (settings == undefined || settings.assignmentType != AssignmentTypes.LINK)
		return null;

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
				<div className="flex text-sm font-medium">
					Site Allow List
					<Info className="ml-2">
						Specify certain sites (the first part of a URL, like like google.com
						or https://www.loc.gov) that students can submit. By default,
						students can submit links from any sites.
					</Info>
				</div>
				<div>
					<TagsInput
						onChange={(tags) =>
							setSettings((settings) => {
								return { ...settings, urls: normalizeURLs(tags) };
							})
						}
						value={settings.urls!}
						//prevents duplicates and checks if it's a link
						validate={(tag) =>
							!settings.urls!.find((url) => tag == url) &&
							/^(https?:\/\/)?([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}(\/.*)?$/g.test(
								tag
							)
						}
						addOnPaste={true}
						className="inputcss form-input cursor-text [&>span]:flex [&>span]:flex-wrap [&>span]:gap-3"
						focusedClassName="ring-1 ring-blue-600"
						inputProps={{
							className: "noinputcss react-tagsinput-input",
							placeholder:
								settings.urls?.length == 0
									? "Add a site to start a whitelist"
									: "Add another site",
						}}
						renderTag={(props) => {
							const {
								tag,
								key,
								disabled,
								onRemove,
								classNameRemove,
								getTagDisplayValue,
								...other
							} = props;
							return (
								<span key={key} {...other}>
									{getTagDisplayValue(tag)}
									{!disabled && (
										<div
											className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-gray-300"
											onClick={(e) => onRemove(key)}
										>
											<XMarkIcon className="h-5 w-5" />
										</div>
									)}
								</span>
							);
						}}
					/>
				</div>
				<p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
					{settings.urls?.length == 0
						? "Students can add links from anywhere to this assignment"
						: "Students can only add links based on the sites above"}
				</p>
			</label>
			<details>
				<summary className="cursor-pointer text-sm font-medium">
					Advanced
				</summary>
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
			</details>
		</>
	);
};

export default Link;
