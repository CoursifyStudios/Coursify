import { Transition, Dialog } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Dispatch, Fragment, SetStateAction } from "react";

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
		<Transition appear show={showCrossPosting} as={Fragment}>
			<Dialog
				open={showCrossPosting}
				onClose={() => setShowCrossPosting(false)}
			>
				<Transition.Child
					enter="ease-out transition"
					enterFrom="opacity-75"
					enterTo="opacity-100 scale-100"
					leave="ease-in transition"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-75"
					as={Fragment}
				>
					<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-4">
						<Transition.Child
							enter="ease-out transition"
							enterFrom="opacity-75 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in transition"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-75 scale-95"
							as={Fragment}
						>
							<Dialog.Panel className="relative w-full max-w-lg rounded-xl bg-white/90 p-4 shadow-md backdrop-blur-xl">
								<h2 className="mb-5 text-lg font-medium">Select Groups...</h2>
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
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
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
