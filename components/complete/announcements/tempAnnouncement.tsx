import { useUser } from "@supabase/auth-helpers-react";
import { Json } from "../../../lib/db/database.types";
import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTabs } from "../../../lib/tabs/handleTabs";
import Editor from "../../editors/richeditor";

export const TempAnnouncement = ({
	announcement,
}: {
	announcement: {
		author: string;
		content: Json;
		title: string;
	};
}) => {
	const user = useUser();
	const { newTab } = useTabs();

	return (
		<div className="mt-2 rounded-xl bg-gray-200 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{announcement.title}</h2>
				<EllipsisVerticalIcon className="h-6 w-6" />
			</div>
			<div className="flex items-center pt-1">
				<Link
					href={"/profile/" + announcement.author}
					className="inline-flex shrink-0 items-center rounded-full px-1 py-0.5 hover:bg-gray-300"
					onClick={() =>
						newTab(
							"/profile/" + announcement.author,
							user?.user_metadata.name.split(" ")[0] + "'s Profile"
						)
					}
				>
					<img
						src={user?.user_metadata.picture}
						alt="Profile picture"
						className="h-5 w-5 rounded-full"
					/>
					<p className="ml-1.5 mr-1 font-semibold text-neutral-700">
						{user?.user_metadata.name}
					</p>
				</Link>
				<p className="pl-1.5 text-gray-600">Posted just now</p>
			</div>
			<Editor
				editable={false}
				initialState={announcement.content}
				className="mt-0.5"
			/>
		</div>
	);
};
