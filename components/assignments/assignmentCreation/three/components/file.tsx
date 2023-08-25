import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import TagsInput from "react-tagsinput";
import { AssignmentFileUpload } from "../settings.types";

const File = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentFileUpload;
		setSettings: Dispatch<SetStateAction<AssignmentFileUpload>>;
	};
}) => {
	useLayoutEffect(() => {
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.FILE_UPLOAD
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.FILE_UPLOAD,
				fileTypes: [],
				maxSize: 6,
				maxFiles: undefined,
				minFiles: 1,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (
		settings == undefined ||
		settings.assignmentType != AssignmentTypes.FILE_UPLOAD
	)
		return null;

	return (
		<>
			<div className="grid grid-cols-3 gap-4">
				<label htmlFor="maxSize" className="relative flex grow flex-col">
					<span className="flex text-sm font-medium">
						Maximum File Size<span className="text-red-600">*</span>
						<Info className="ml-2">
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
						className="grow"
						name="maxSize"
						onChange={(e) =>
							setSettings((settings) => {
								return { ...settings, maxSize: parseInt(e.target.value) };
							})
						}
					/>
					<p className="absolute bottom-2 right-3 z-10 font-medium">MB</p>
				</label>
				<label htmlFor="minFiles" className="flex grow flex-col">
					<span className="flex text-sm font-medium">
						Minimum Files Required<span className="text-red-600">*</span>
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
					<span className="flex text-sm font-medium">
						Maximum Files Allowed
					</span>
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
					Allowed file formats
					<Info className="ml-2">
						Specify which file extensions (the last part of a file name, such as
						.jpg, .pdf, .mp4 or .gif) that students can submit.
					</Info>
				</div>
				<div>
					<TagsInput
						onChange={(tags) =>
							setSettings((settings) => {
								return {
									...settings,
									fileTypes: tags.map((t) => (t.startsWith(".") ? t : `.${t}`)),
								};
							})
						}
						value={settings.fileTypes!}
						//prevents duplicates and checks if it's a link
						validate={(tag) =>
							!settings.fileTypes!.find((url) => tag == url) &&
							/^\.?[A-z0-9]{1,}$/g.test(tag)
						}
						addOnPaste={true}
						className="inputcss form-input cursor-text [&>span]:flex [&>span]:flex-wrap [&>span]:gap-3"
						focusedClassName="ring-1 ring-blue-600"
						inputProps={{
							className: "noinputcss react-tagsinput-input",
							placeholder:
								settings.fileTypes?.length == 0
									? "Enter a file extension..."
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
					Students can only add media content in the formats listed above. Leave
					the field blank to allow all file formats.
				</p>
			</label>
		</>
	);
};

export default File;
