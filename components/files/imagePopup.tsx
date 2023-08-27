import { Popup } from "../misc/popup";
import { CoursifyFile } from "./genericFileUpload";
import Image from "next/image";

export const BigImagePreview = ({
	file,
	open,
	setOpen,
}: {
	file: CoursifyFile;
	open: boolean;
	setOpen: (value: boolean) => void;
}) => {
	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="lg">
			<p>{file.name}</p>
			<Image
				src={file.link}
				alt={`ugc image of ${file.name}`}
				width={1024}
				height={768}
				className="rounded object-cover object-center shrink-0 mt-1"
				unoptimized
			/>
		</Popup>
	);
};
