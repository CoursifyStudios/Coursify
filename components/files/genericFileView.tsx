import { formatBytes } from "@/lib/misc/convertBytes";
import { LoadingSmall } from "../misc/loading";
import { CoursifyFile } from "./genericFileUpload";
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const mediaFileExtensions = [
	"png",
	"jpg",
	"jpeg",
	"dng",
	"gif",
	"mp4",
	"webp",
	"JPG",
];

export const FileView = ({
	file,
	deleteFile,
	size = 24,
}: {
	file: CoursifyFile;
	deleteFile: (value: string) => void;
	size?: number;
}) => {
	return (
		<div className="rounded-lg border border-gray-300 p-3 flex items-center">
			{" "}
			{!file.uploading &&
			mediaFileExtensions.includes(file.realName.split(".").pop() || "") ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={file.link}
					alt={`ugc image of ${file.realName}`}
					width={size}
					height={size}
					className={`rounded object-cover object-center h-${size / 4}`}
				/>
			) : (
				<DocumentIcon
					className={`min-w-[1.5rem] w-${size / 4} h-${size / 4} px-1`}
				/>
			)}
			<div className="truncate mx-2 ">
				<span className="truncate max-w-xs text-sm font-medium">
					{file.realName}
				</span>
				<p className="text-xs">
					.{file.realName.split(".").pop()} file, {formatBytes(file.size)}
				</p>
			</div>
			{file.uploading ? (
				<div className="ml-auto">
					<LoadingSmall />
				</div>
			) : (
				<div
					className="rounded hover:bg-gray-300 p-0.5 ml-auto cursor-pointer"
					onClick={() => deleteFile(file.fileName)}
				>
					<XMarkIcon className="h-4 w-4 text-red-500" />
				</div>
			)}
		</div>
	);
};
