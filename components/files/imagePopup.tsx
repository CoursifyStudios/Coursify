import Image from "next/image";
import { Popup } from "../misc/popup";
import { CoursifyFile } from "./genericFileUpload";

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
			<p>{file.realName}</p>
			<Image
				title={file.realName}
				src={file.link}
				alt={`ugc image of ${file.realName}`}
				width={1024}
				height={768}
				className="rounded object-scale-down object-center shrink-0 mt-1"
			/>
		</Popup>
	);
};
