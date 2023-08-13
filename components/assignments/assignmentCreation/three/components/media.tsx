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
			<div className="w-full flex gap-4">
				<label htmlFor="maxSize" className="w-full relative flex grow flex-col">
					<span className="w-full flex text-sm font-medium">
						Maximum File Size<span className="w-full text-red-600">*</span>
						<Info className="w-full ml-2">
							Set a maximum file size, per file, in megabytes, up to 5000. For
							reference: a 4K image RAW is just over 24 megabytes, and 10
							minutes of 1080p 60fps video can be several gigabytes in size.
							Note that many file formats severely compress these files,
							reducing their size.
						</Info>
					</span>

					<input
						type="number"
						defaultValue={settings.maxSize}
						className="w-full grow"
						name="maxSize"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, maxSize: parseInt(e.target.value) };
							})
						}
					/>
					<p className="w-full absolute bottom-2 right-3 z-10 font-medium">
						MB
					</p>
				</label>
				<label htmlFor="minFiles" className="w-full flex grow flex-col">
					<span className="w-full flex text-sm font-medium">
						Minimum Files Required<span className="w-full text-red-600">*</span>
					</span>
					<input
						type="number"
						defaultValue={settings.minFiles}
						className="w-full grow"
						name="minFiles"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, minFiles: parseInt(e.target.value) };
							})
						}
					/>
				</label>
				<label htmlFor="maxFiles" className="w-full flex grow flex-col">
					<span className="w-full flex text-sm font-medium">
						Maximum Files Allowed
					</span>
					<input
						type="number"
						defaultValue={settings.maxFiles}
						className="w-full grow"
						name="maxFiles"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, maxFiles: parseInt(e.target.value) };
							})
						}
					/>
				</label>
			</div>
			<label htmlFor="fileTypes" className="w-full flex grow flex-col">
				<div className="w-full flex text-sm font-medium">
					Allowed file formats
					<Info className="w-full ml-2">
						Specify which file extensions (the last part of a file name, such as
						.jpg, .pdf, .mp4 or .gif) that students can submit.
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
						className="w-full inputcss form-input cursor-text [&>span]:flex [&>span]:flex-wrap [&>span]:gap-3"
						focusedclassName="w-full ring-1 ring-blue-600"
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
											className="w-full ml-1 cursor-pointer rounded-full p-0.5 hover:bg-gray-300"
											onClick={(e) => {
												if (settings.fileTypes?.length > 1) onRemove(key);
											}}
										>
											<XMarkIcon className="w-full h-5 w-5" />
										</div>
									)}
								</span>
							);
						}}
					/>
				</div>
				<p className="w-full mt-0.5 text-xs text-gray-600 dark:text-gray-400">
					{settings.fileTypes?.length == 0
						? "Students can add files with any extension to this assignment" //This is impossible, as this page only allows 1 or more file formats, not 0
						: "Students can only add media content in the formats listed above."}
				</p>
			</label>
		</>
	);
};

export default Media;
