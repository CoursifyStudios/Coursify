import Image from "next/image";
import { CoursifyFile } from "./genericFileUpload";
import { DocumentIcon } from "@heroicons/react/24/outline";

export const mediaFileExtensions = [
	"png",
	"jpg",
	"jpeg",
	"dng",
	"gif",
	"mp4",
	"webp",
];

export const FileView = ({
	file,
	size = 24,
}: {
	file: CoursifyFile;
	size?: number;
}) => {
	return (
		<>
			{mediaFileExtensions.includes(file.realName.split(".").pop() || "") ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={file.link}
					alt={`ugc image of ${file.realName}`}
					width={size}
					height={size}
					className={`rounded object-cover object-center h-${size / 4}`}
				/>
			) : (
				<DocumentIcon className="min-w-[1.5rem] w-6 h-6" />
			)}
		</>
	);
};
