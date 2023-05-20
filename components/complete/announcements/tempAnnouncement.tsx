import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { Json } from "../../../lib/db/database.types";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import { howLongAgo } from "../../../lib/misc/dates";
import { useTabs } from "../../../lib/tabs/handleTabs";
import Editor from "../../editors/richeditor";

export const TempAnnouncement = ({
	announcement,
}: {
	announcement: {
		author: string;
		content: Json;
		title: string | null;
		id?: string;
		time?: string | null;
		users?:
			| {
					avatar_url: string;
					full_name: string;
			  }
			| {
					avatar_url: string;
					full_name: string;
			  }[]
			| null;
	};
}) => {
	const user = useUser();
	const { newTab } = useTabs();

	return (
		<div className="brightness-hover mt-2 w-full rounded-xl bg-gray-300 p-4 dark:bg-gray-200">
			<div
				className={announcement.time ? "" : "flex items-center justify-between"}
			>
				<h2 className="text-xl font-semibold">{announcement.title}</h2>
				{!announcement.time && <EllipsisVerticalIcon className="h-6 w-6" />}
			</div>
			<div className="flex items-center pt-1">
				<Link
					href={"/profile/" + announcement.author}
					className="inline-flex shrink-0 items-center rounded-full px-1 py-0.5 hover:bg-gray-300"
					onClick={() =>
						newTab(
							"/profile/" + announcement.author,
							(announcement.users
								? getDataOutArray(announcement.users).full_name
								: user?.user_metadata.name
							).split(" ")[0] + "'s Profile"
						)
					}
				>
					<img
						src={
							announcement.users
								? getDataOutArray(announcement.users!).avatar_url
								: user?.user_metadata.picture
						}
						alt="Profile picture"
						className="h-5 w-5 rounded-full"
					/>
					<p className="ml-1.5 mr-1 font-semibold text-neutral-700">
						{announcement.users
							? getDataOutArray(announcement.users!).full_name
							: user?.user_metadata.name}
					</p>
				</Link>
				<p className="pl-1.5 text-gray-600">
					{announcement.time
						? howLongAgo(announcement.time)
						: "Posted just now"}
				</p>
			</div>
			<Editor
				editable={false}
				initialState={announcement.content}
				className="mt-0.5"
			/>
		</div>
	);
};
