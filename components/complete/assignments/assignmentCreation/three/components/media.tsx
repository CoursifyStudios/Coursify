import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import TagsInput from "react-tagsinput";
import { AssignmentMedia } from "../settings.types";

const Media = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentMedia;
		setSettings: Dispatch<SetStateAction<AssignmentMedia>>;
	};
}) => {
	useLayoutEffect(() => {
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.MEDIA
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.MEDIA,
				fileTypes: [
					".png",
					".jpg",
					".jpeg",
					".dng",
					".gif",
					".mp4",
					".mov",
					".webp",
				],
				maxSize: 6,
				maxFiles: undefined,
				minFiles: 1,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (settings == undefined || settings.assignmentType != AssignmentTypes.MEDIA)
		return null;

	return (
		<>
			<div className="flex gap-4">
				<label htmlFor="maxSize" className="relative flex grow flex-col">
					<span className="flex text-sm font-medium">
						Max File Size<span className="text-red-600">*</span>
						<Info className="ml-2">
							The maximum file size, per file, in megabytes.
						</Info>
					</span>

					<input
						type="number"
						defaultValue={settings.maxSize}
						className="grow"
						name="maxSize"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, maxSize: parseInt(e.target.value) };
							})
						}
					/>
					<p className="absolute bottom-2 right-3 z-10 font-medium">mb</p>
				</label>
				<label htmlFor="minFiles" className="flex grow flex-col">
					<span className="flex text-sm font-medium">
						Min Files Required<span className="text-red-600">*</span>
					</span>
					<input
						type="number"
						defaultValue={settings.minFiles}
						className="grow"
						name="minFiles"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, minFiles: parseInt(e.target.value) };
							})
						}
					/>
				</label>
				<label htmlFor="maxFiles" className="flex grow flex-col">
					<span className="flex text-sm font-medium">Max Files Allowed</span>
					<input
						type="number"
						defaultValue={settings.maxFiles}
						className="grow"
						name="maxFiles"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, maxFiles: parseInt(e.target.value) };
							})
						}
					/>
				</label>
			</div>
			<label htmlFor="fileTypes" className="flex grow flex-col">
				<div className="flex text-sm font-medium">
					File Extensions Allow List
					<Info className="ml-2">
						Specify certain file extensions (the last part of a file part of a
						file, like like .jpg or .gif) that students can submit.
					</Info>
				</div>
				<div>
					<TagsInput
						onChange={(tags) =>
							setSettings((settings) => {
								return { ...settings, fileTypes: tags };
							})
						}
						value={settings.fileTypes!}
						//prevents duplicates and checks if it's a link
						validate={(tag) =>
							!settings.fileTypes!.find((url) => tag == url) &&
							/^\.[A-z]{1,4}$/g.test(tag)
						}
						addOnPaste={true}
						className="inputcss form-input cursor-text [&>span]:flex [&>span]:flex-wrap [&>span]:gap-3"
						focusedClassName="ring-1 ring-blue-600"
						inputProps={{
							className: "noinputcss react-tagsinput-input",
							placeholder:
								settings.fileTypes?.length == 0
									? "Add an extension to start a whitelist"
									: "Add another extension",
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
											onClick={(e) => {
												if (settings.fileTypes?.length > 1) onRemove(key);
											}}
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
					{settings.fileTypes?.length == 0
						? "Students can add files with any extension to this assignment"
						: "Students can only add files based on the file extensions above"}
				</p>
			</label>
		</>
	);
};

export default Media;