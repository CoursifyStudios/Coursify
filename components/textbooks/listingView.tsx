import { CoursifyFile } from "../files/genericFileUpload";
import { BetterFileCarousel } from "../files/genericFileView";
import { Popup } from "../misc/popup";

export const ListingView = ({
	open,
	setOpen,
	title,
	listingInfo,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
	title: string;
	listingInfo: {
		id: string;
		pictures: CoursifyFile[];
		info: string;
		price: number;
		pricing_flexible: boolean;
	};
}) => {
	return (
		<Popup closeMenu={() => setOpen(false)} open={open}>
			<section>
				<h2>
					{title} - ${listingInfo.price}{" "}
					{listingInfo.pricing_flexible && "(flexible)"}
				</h2>
			</section>
			<BetterFileCarousel allFiles={listingInfo.pictures}></BetterFileCarousel>
			<p>{listingInfo.info}</p>
		</Popup>
	);
};
