import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { CoursifyFile } from "./genericFileUpload";

//needs to be a seperate component for the hover state
export const DownloadableFile = ({ file }: { file: CoursifyFile }) => {
	return (
		<a
			href={file.link}
			download
			title={"Download " + file.realName}
			className="group m-1 p-2 pr-3 gap-1 flex rounded-2xl items-center bg-gray-300"
		>
			<ArrowDownTrayIcon className="hidden group-hover:block min-w-[1.5rem] w-6 h-6" />

			<DocumentIcon className="group-hover:hidden min-w-[1.5rem] w-6 h-6" />

			<p>{file.realName}</p>
		</a>
	);
};
