import { useState } from "react";
import {
	AnnouncementType,
	TypeOfAnnouncements,
} from "../../../lib/db/announcements";
import { Announcement } from ".";
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
		<div>
			{tempAnnouncements.reverse().map(
				(announcement) =>
					announcement && (
						<Announcement
							key={announcement.id}
							announcement={{
								id: announcement.id,
								author: announcement.author,
								title: announcement.title,
								content: announcement.content,
								time: announcement.time,
								type: announcement.type,
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
								key={announcement.id}
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
