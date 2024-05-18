import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { Popup } from "../../misc/popup";

export const CommunityPicker = ({
	chosenCommunities,
	communities,
	setShowCrossPosting,
	showCrossPosting,
	setChosenCommunities,
	communityid,
}: {
	showCrossPosting: boolean;
	setShowCrossPosting: Dispatch<SetStateAction<boolean>>;
	communities: { id: string; name: string }[];
	chosenCommunities: { id: string; name: string }[];
	setChosenCommunities: Dispatch<
		SetStateAction<{ id: string; name: string }[]>
	>;
	communityid: string;
}) => {
	return (
		<Popup
			closeMenu={() => setShowCrossPosting(false)}
			open={showCrossPosting}
			size="xs"
		>
			<h2 className="mb-5 text-lg font-medium">Select Communities...</h2>
			<div className="h- grid grid-cols-2 gap-2">
				{communities.length != 0
					? communities.map((community) => {
							const isChosen = Boolean(
								chosenCommunities.find((c) => c.id == community.id)
							);
							if (community.id == communityid) return null;
							return (
								<button
									key={community.id}
									className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left font-medium ${
										isChosen
											? "brightness-hover bg-gray-200"
											: "hover:bg-gray-200"
									} focus:outline-none`}
									onClick={() => {
										addOrRemoveCommunity(community, !isChosen);
									}}
								>
									<p className="truncate">{community.name}</p>
									{isChosen ? (
										<CheckCircleIcon className="ml-2 h-5 w-5 min-w-[1.25rem] text-gray-700" />
									) : (
										<div className="w-7" />
									)}
								</button>
							);
						})
					: [...new Array(6)].map((_, i) => (
							<div
								key={i}
								className="h-12 animate-pulse rounded-lg bg-gray-200"
							/>
						))}
			</div>
		</Popup>
	);

	function addOrRemoveCommunity(
		community: { id: string; name: string },
		trueIfAdd: boolean
	) {
		if (trueIfAdd) {
			setChosenCommunities((communities) => communities.concat([community]));
		} else if (!trueIfAdd) {
			setChosenCommunities((communities) =>
				communities.filter((c) => c.id != community.id)
			);
		}
	}
};
