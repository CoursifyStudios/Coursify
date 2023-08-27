import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { FileView } from "./genericFileView";

// note that many bits of this we might want to componenet-ize so we can reuse them in
// components/assignments/assignmentPanel/components/file.tsx
// this copies some stuff from there but serves as a simpler file uploader that is only a file uploader (not involved in submission)
// I haven't exchanged bits of that file for these componenzts because I don't want merge conflicts as submissions is being worked on right now

const GenericFileUpload: NextPage<{
	files: CoursifyFile[];
	setFiles: Dispatch<SetStateAction<CoursifyFile[]>>;
	destination: string;
}> = ({ files, setFiles, destination }) => {
	const user = useUser();
	const [error, setError] = useState("");
	const converter = useRef(null);

	const addFile = async (file: File) => {
		if (!file) return;
		setError("");

		if (file.size > 104857600) {
			setError(`One of your files is too big. Max size in bytes: ${104857600}`);
			return;
		}

		const UUID = window.crypto.randomUUID();
		const name = `${UUID}--${user!.id}`;
		const path = `${destination}/${name}`;
		setFiles(
			files.concat({
				link: "",
				name: file.name,
				dbName: name,
				size: file.size,
			})
		);
		// setFiles(
		// 	files.concat({
		// 		link: `https://cdn.coursify.one/storage/v1/object/public/ugc/${path}`,
		// 		name: file.name,
		// 		dbName: name,
		// 		size: file.size,
		// 	})
		// );
		// const { data, error } = await supabase.storage
		// 	.from("ugc")
		// 	.upload(path, file);

		// if (error) {
		// 	setError(error.message);
		// 	return;
		// } else {
		// 	setFiles((files) =>
		// 		files.map((f) => {
		// 			if (f.fileName != name) return f;
		// 			const { uploading: _, ...newFile } = f;
		// 			return newFile;
		// 		})
		// 	);
		// }
	};
	// Handles File Upload

	const removeFile = async (fileName: string) => {
		setFiles((files) => files.filter((file) => file.name != fileName));

		// const test = await supabase.functions.invoke("delete-file", {
		// 	body: {
		// 		path: [`${destination}/${fileName}`],
		// 	},
		// });
		// if (error) {
		// 	setError("Failed to delete file!");
		// 	setFiles((files) =>
		// 		files.map((f) => {
		// 			if (f.fileName != fileName) return f;
		// 			const { uploading: _, ...newFile } = f;
		// 			return newFile;
		// 		})
		// 	);
		// 	return;
		// } else {
		// 	setFiles((files) => files.filter((file) => file.fileName != fileName));
		// }
	};

	return (
		<>
			<canvas ref={converter} hidden></canvas>
			{files.length > 0 && (
				<div className="grid lg:grid-cols-2 gap-2">
					{files.map((file, i) => (
						<FileView key={i} file={file} deleteFile={removeFile} size={48} />
					))}
				</div>
			)}
			<label
				className="rounded-lg bg-gray-300 p-3 flex items-center brightness-hover cursor-pointer"
				onChange={(e) => {
					// @ts-expect-error idk what react is on but files will be defined
					addFile([...e.target.files][0]);
				}}
				title="Upload a file"
			>
				<DocumentArrowUpIcon className="w-6 h-6" />
				<div className="ml-4">
					<h4 className="font-medium text-sm">Upload File</h4>
					<p className="text-xs">Click to select or drop file</p>
				</div>
				<input type="file" className="hidden" />
			</label>
			{error && (
				<div className="text-red-500 text-sm">
					Error occured while uploading: {error}
				</div>
			)}
		</>
	);
};

export default GenericFileUpload;

export interface CoursifyFile {
	link: string;
	dbName: string;
	name: string;
	size: number;
}