import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Database } from "../../lib/db/database.types";
import { getDataInArray } from "../../lib/misc/dataOutArray";
import { howLongAgo } from "../../lib/misc/formatDate";


export const Announcement = ({
	announcement,
}: {
	announcement: Database["public"]["Tables"]["announcements"]["Row"]
}) => {
	return (
		<div className="rounded-xl bg-gray-200 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">{announcement.title}</h2>
				<EllipsisVerticalIcon className="h-6 w-6" />
			</div>
			<div className="flex items-center pt-1 pb-2">
				<div className="inline-flex shrink-0 items-center rounded-full bg-gray-300 px-2.5 py-0.5">
					<div className="h-4 w-4 rounded-full bg-white"></div>
					<p className="ml-1.5 font-semibold text-neutral-700">{announcement.author}</p>
				</div>
				<p className="pl-2.5 text-gray-600">{howLongAgo(announcement.time!)}</p>
			</div>
			<p>{announcement.content}</p>
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