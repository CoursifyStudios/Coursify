import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { CoursifyFile } from "./genericFileUpload";
import { useState } from "react";

//needs to be a seperate component for the hover state
export const DownloadableFile = ({ file }: { file: CoursifyFile }) => {
	const [hovered, setHovered] = useState(false);
	return (
		<a
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			href={file.link}
			download
			title={"Download " + file.realName}
			className="m-1 p-2 pr-3 gap-1 flex rounded-2xl items-center bg-gray-300"
		>
			{hovered ? (
				<ArrowDownTrayIcon className="min-w-[1.5rem] w-8 h-8" />
			) : (
				<DocumentIcon className="min-w-[1.5rem] w-8 h-8" />
			)}

			<p>{file.realName}</p>
		</a>
	);
};
