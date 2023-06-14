import { useState } from "react";
import { Announcement } from ".";
import {
	AnnouncementType,
	TypeOfAnnouncements,
} from "../../../lib/db/announcements";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";

export const AnnouncementsComponent = ({
	announcements,
	communityid,
}: {
	announcements: TypeOfAnnouncements[];
	communityid: string;
}) => {
	const [tempAnnouncements, setTempAnnouncements] = useState<
		TypeOfAnnouncements[]
	>([]);
	return (
		<div className="space-y-4">
			{/* rendering temporary announcements */}
			{tempAnnouncements.reverse().map(
				(announcement) =>
					announcement && (
						<Announcement
							key={announcement.id + "temp"}
							announcement={{
								id: announcement.id,
								author: announcement.author,
								title: announcement.title,
								content: announcement.content,
								time: announcement.time,
								type: announcement.type,
								clone_id: announcement.clone_id,
								users: announcement.users,
							}}
							classID={communityid}
							comments={
								announcements.filter(
									(possibleComment) =>
										(possibleComment &&
											possibleComment?.type == AnnouncementType.COMMENT &&
											getDataOutArray(possibleComment?.parent)?.id ==
												announcement.id) ||
										(possibleComment?.type == AnnouncementType.REPLY &&
											getDataOutArray(possibleComment.parent)?.type ==
												AnnouncementType.COMMENT)
								) as TypeOfAnnouncements[]
							}
							announcements={tempAnnouncements}
							setAnnouncements={setTempAnnouncements}
						></Announcement>
					)
			)}
			{/* render announcements that exist on the db, both pre-existing and new ones (i.e. newly posted, edited announcements)  */}
			{announcements
				.sort((a, b) => {
					if (new Date(a.time!).getTime() > new Date(b.time!).getTime())
						return -1;
					if (new Date(a.time!).getTime() < new Date(b.time!).getTime())
						return 1;
					return 0;
				})
				.map(
					(announcement) =>
						(announcement.type == AnnouncementType.ANNOUNCMENT ||
							announcement.type == AnnouncementType.CROSSPOST) && (
							<Announcement
								key={announcement.id + "other"}
								announcement={announcement as TypeOfAnnouncements}
								comments={
									announcements.filter(
										(possibleComment) =>
											(possibleComment &&
												possibleComment?.type == AnnouncementType.COMMENT &&
												getDataOutArray(possibleComment?.parent)?.id ==
													announcement.id) ||
											(possibleComment?.type == AnnouncementType.REPLY &&
												getDataOutArray(possibleComment.parent)?.type ==
													AnnouncementType.COMMENT)
									) as TypeOfAnnouncements[]
								}
								classID={communityid}
								announcements={tempAnnouncements}
								setAnnouncements={setTempAnnouncements}
							></Announcement>
						)
				)}
		</div>
	);
};
