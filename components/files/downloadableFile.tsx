import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { CoursifyFile } from "./genericFileUpload";

//needs to be a seperate component for the hover state
export const DownloadableFile = ({
	file,
	className,
}: {
	file: CoursifyFile;
	className?: string;
}) => {
	return (
		<a
			href={file.link}
			download
			className={`group px-3 py-4 flex rounded-xl items-center bg-gray-300 font-medium ${className}`}
		>
			<ArrowDownTrayIcon className="absolute scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition min-w-[1.5rem] w-6 h-6 mr-2 " />

			<DocumentIcon className="group-hover:opacity-0 group-hover:scale-75 transition min-w-[1.5rem] w-6 h-6 mr-2" />

			<p>{file.name}</p>
		</a>
	);
};
