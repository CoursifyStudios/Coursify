import {
	EllipsisVerticalIcon,
	EnvelopeIcon,
	IdentificationIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Database, Json } from "../../lib/db/database.types";
import { getDataOutArray } from "../../lib/misc/dataOutArray";
import { howLongAgo } from "../../lib/misc/formatDate";
import { useTabs } from "../../lib/tabs/handleTabs";
import Editor from "../editors/richeditor";
import { ColoredPill, CopiedHover } from "./pill";

export const Announcement = ({
	announcement,
}: {
	announcement: {
		author: string;
		content: Json;
		id: string;
		time: string | null;
		title: string | null;
		users:
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
	return (
		<div className="rounded-xl bg-gray-200 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{announcement.title}</h2>
				<EllipsisVerticalIcon className="h-6 w-6" />
			</div>
			<div className="flex items-center pt-1 pb-2">
				<div className="inline-flex shrink-0 items-center rounded-full bg-gray-300 px-1 py-0.5">
					<img
						src={getDataOutArray(announcement.users!).avatar_url}
						alt=""
						className="h-5 w-5 rounded-full"
					/>
					<p className="ml-1.5 font-semibold text-neutral-700">
						{getDataOutArray(announcement.users!).full_name}
					</p>
				</div>
				<p className="pl-2.5 text-gray-600">{howLongAgo(announcement.time!)}</p>
			</div>
			<Editor
				editable={false}
				initialState={announcement.content}
				className="mt-2"
			/>
			{/* <div className="mt-4 flex items-center justify-between">
				<div className="mr-24 flex-grow items-center rounded-full bg-gray-300 p-1">
					<p className="ml-1.5 p-1">Insert response here</p>
				</div>
				<div className="rounded-full bg-gray-300 p-2">
					<FaceSmileIcon className="h-6 w-6" />
				</div>
			</div> */}
		</div>
	);
};

export const Member = ({
	user,
	leader,
}: {
	user: {
		id: string;
		full_name: string;
		avatar_url: string;
		email: string | null;
	};
	leader: boolean;
}) => {
	const { newTab } = useTabs();
	return (
		<Link
			className="brightness-hover flex rounded-xl bg-gray-200 p-6"
			key={user.id}
			href={"/profile/" + user.id}
			onClick={() =>
				newTab(
					"/profile/" + user.id,
					user.full_name.split(" ")[0] + "'s Profile"
				)
			}
		>
			<div className="relative h-max">
				<img
					src={user.avatar_url!}
					alt="Profile picture"
					referrerPolicy="no-referrer"
					className=" h-10 rounded-full shadow-md shadow-black/25"
				/>
				{leader && (
					<div className="absolute -bottom-1 -right-1  flex rounded-full bg-yellow-100 p-0.5">
						<IdentificationIcon className="h-4 w-4 text-yellow-600" />
					</div>
				)}
			</div>
			<div className="ml-4 flex flex-col">
				<h2 className="mb-1 font-medium">{user.full_name}</h2>
				<CopiedHover copy={user.email ?? "No email found"}>
					<ColoredPill color="gray">
						<div className="flex items-center">
							<EnvelopeIcon className="mr-1.5 h-4 w-4 text-gray-800" />
							{user.email &&
								user.email.slice(0, 20) +
									(user.email?.length > 20 ? "..." : "")}
						</div>
					</ColoredPill>
				</CopiedHover>
			</div>
		</Link>
	);
};
