import { CoursifyFile } from "../files/genericFileUpload";
import Image from "next/image";
import { ImagePreview } from "../files/imagePreview";
import Link from "next/link";
import { useTabs } from "@/lib/tabs/handleTabs";
import { handleConditions } from "@/lib/db/textbooks";
import {
	EllipsisVerticalIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import MenuSelect from "../misc/menu";
import { Delete } from "./delete";
import { useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Database } from "@/lib/db/database.types";
import { CreateListing } from "./createListing";

export const Listing = ({
	listing,
}: {
	listing: {
		id: string;
		textbooks: {
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
		} | null;
		users: {
			id: string;
			full_name: string;
			avatar_url: string;
			email: string;
		} | null;
		pictures: CoursifyFile[];
		condition: number;
		info: string;
		price: number;
		pricing_flexible: boolean;
	};
}) => {
	const { newTab } = useTabs();
	const user = useUser();
	const [info, setInfo] = useState(listing);
	const [showDeleting, setShowDeleting] = useState(false);
	const [showEditing, setShowEditing] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const supabase = useSupabaseClient<Database>();
	return (
		<>
			<CreateListing
				open={showEditing}
				setOpen={setShowEditing}
				supabase={supabase}
				book={{ id: info.textbooks?.id!, title: info.textbooks?.title! }}
				addListing={(newListing) =>
					setInfo({
						...newListing,
						textbooks: listing.textbooks,
						users: listing.users,
					})
				}
				editingInfo={{ ...info, clear: () => {} }}
			/>
			<Delete
				open={showDeleting}
				setOpen={setShowDeleting}
				setDeleted={setDeleted}
				supabase={supabase}
				pictures={info.pictures.map((picture) => picture.dbName)}
				id={listing.id}
			/>
			<div className=" p-4 rounded-lg bg-gray-200" hidden={deleted}>
				<p>{info.textbooks?.title}</p>
				{info.pictures && info.pictures.length > 0 ? (
					<ImagePreview file={info.pictures[0]} />
				) : (
					<p className="p-3 bg-orange-400 grow h-48 rounded-lg">No image</p>
				)}

				<p>
					{handleConditions(info.condition)} - ${info.price}
					{info.pricing_flexible && " (Flexible)"}
				</p>

				<div className="flex justify-between">
					<Link
						href={"/profile/" + listing.users!.id}
						className="inline-flex shrink-0 items-center rounded-full px-1 py-0.5 hover:bg-gray-300"
						onClick={() =>
							newTab(
								"/profile/" + listing.users?.id,
								(listing.users?.full_name)!.split(" ")[0] + "'s Profile"
							)
						}
					>
						<Image
							src={listing.users?.avatar_url!}
							alt="Profile picture"
							className="h-5 w-5 rounded-full"
							referrerPolicy="no-referrer"
							width={20}
							height={20}
						/>
						<p className="ml-1.5 mr-1 font-semibold text-gray-700">
							{listing.users?.full_name!}
						</p>
					</Link>

					{user!.id == listing.users?.id && (
						<MenuSelect
							items={[
								{
									content: (
										<>
											{" "}
											Edit <PencilIcon className="h-5 w-5" />{" "}
										</>
									),
									onClick: () => {
										setShowEditing(true);
									},
								},
								{
									content: (
										<>
											{" "}
											Delete <TrashIcon className="h-5 w-5" />{" "}
										</>
									),
									onClick: () => {
										setShowDeleting(true);
									},
								},
							]}
						>
							<div className=" rounded-md p-0.5 hover:bg-gray-200">
								<EllipsisVerticalIcon className="h-6 w-6" />
							</div>
						</MenuSelect>
					)}
				</div>
			</div>
		</>
	);
};
