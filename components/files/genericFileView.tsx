import { formatBytes } from "@/lib/misc/convertBytes";
import { LoadingSmall } from "../misc/loading";
import { CoursifyFile } from "./genericFileUpload";
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { DownloadableFile } from "./downloadableFile";
import { ImagePreview } from "./imagePreview";

export const viewableFileExtensions = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"JPG",
	"avif",
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
	if (file)
		return (
			<div className="rounded-lg border border-gray-300 p-3 flex items-center">
				{file.link != "" &&
				viewableFileExtensions.includes(file.name?.split(".").pop() || "") ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={file.link}
						alt={`ugc image of ${file.name!}`}
						width={size}
						height={size}
						className={`rounded object-cover object-center h-${size / 4}`}
					/>
				) : (
					<DocumentIcon
						className={`min-w-[1.5rem] w-${size / 8} h-${size / 8} mx-3`}
					/>
				)}
				<div className="truncate mx-2 ">
					<span className="truncate max-w-xs text-sm font-medium">
						{file.name}
					</span>
					<p className="text-xs">
						.{file.name.split(".").pop()} file, {formatBytes(file.size)}
					</p>
				</div>
				<div
					className="rounded hover:bg-gray-300 p-0.5 ml-auto cursor-pointer"
					onClick={() => deleteFile(file.name!)}
				>
					<XMarkIcon className="h-4 w-4 text-red-500" />
				</div>
			</div>
		);
	return;
};

export const FileCarousel = ({ files }: { files: CoursifyFile[] }) => {
	return (
		<>
			<div className=" mb-2">
				{files?.map(
					(file, index) =>
						file &&
						!viewableFileExtensions.includes(
							file.name?.split(".").pop() || ""
						) && <DownloadableFile key={index} file={file} />
				)}
			</div>
			<div className="flex gap-4 overflow-x-auto">
				{files?.map(
					(file, index) =>
						file &&
						viewableFileExtensions.includes(
							file.name?.split(".").pop() || ""
						) && <ImagePreview key={index} file={file} />
				)}
			</div>
		</>
	);
};
