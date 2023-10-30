import { useState } from "react";
import { CoursifyFile } from "./genericFileUpload";
import { BigImagePreview } from "./imagePopup";
import Image from "next/image";

export const ImagePreview = ({ file }: { file: CoursifyFile }) => {
	const [showBigPicture, setShowBigPicture] = useState(false);
	return (
		<>
			{showBigPicture ? (
				<BigImagePreview
					file={file}
					open={showBigPicture}
					setOpen={setShowBigPicture}
				/>
			) : (
				<div
					className="relative shrink-0 group"
					title={file.name}
					onClick={() => setShowBigPicture(true)}
				>
					<Image
						src={file.link}
						alt={`ugc image of ${file.name}`}
						width={192}
						height={192}
						className="mx-auto rounded object-cover object-center !min-w-48 h-48"
					/>
					<p className="hidden group-hover:block text-white pl-1 text-sm absolute bottom-0 w-full backdrop-brightness-50">
						{file.name}
					</p>
				</div>
			)}
		</>
	);
};
