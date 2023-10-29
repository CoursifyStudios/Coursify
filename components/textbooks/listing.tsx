import { CoursifyFile } from "../files/genericFileUpload";
import Image from "next/image";

export const Listing = ({
	listingInfo,
}: {
	listingInfo: {
		id: string;
		textbook: {
			id: string;
			subject: string;
			course: string;
			isbn: string;
			title: string;
			author: string | null;
			edition: string | null;
			publisher: string | null;
			adoption_level: string | null;
			new_only: string | null;
		};
		seller: {
			id: string;
			full_name: string;
			avatar_url: string;
			email: string;
		};
		pictures: CoursifyFile[];
		condition: string;
		info: string;
		price: number;
		pricing_flexible: boolean;
	};
}) => {
	return (
		<div className="p-4 bg-gray-400 rounded-md">
			<Image
				src={listingInfo.pictures[0].link}
				alt="Image of a textbook"
			></Image>
		</div>
	);
};
