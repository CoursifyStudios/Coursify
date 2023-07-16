import { useState } from "react";
import { Announcement } from ".";
import {
	AnnouncementType,
	TypeOfAnnouncements,
} from "../../../lib/db/announcements";
import { getDataOutArray } from "../../../lib/misc/dataOutArray";
import { AnnouncementPostingUI } from "./announcementPosting";

export const AnnouncementsComponent = ({
	fetchedAnnouncements,
	communityid,
	showPostingUI,
}: {
	fetchedAnnouncements: TypeOfAnnouncements[];
	communityid: string;
	showPostingUI: boolean;
}) => {
	const [tempAnnouncements, setTempAnnouncements] = useState<
		TypeOfAnnouncements[]
	>([]); //recently edited comments, announcements and stuff
	const [recentlyPostedAnnouncements, setRecentlyPostedAnnouncements] =
		useState<TypeOfAnnouncements[]>([]);
	return (
		<div className="space-y-4">
			<AnnouncementPostingUI
				announcements={recentlyPostedAnnouncements}
				setAnnouncements={setRecentlyPostedAnnouncements}
				communityid={communityid}
			/>
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
								recentlyPostedAnnouncements
									.concat(fetchedAnnouncements)
									.filter(
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
			{recentlyPostedAnnouncements
				.concat(fetchedAnnouncements)
				.sort((a, b) => {
					if (new Date(a.time!).getTime() > new Date(b.time!).getTime())
						return -1;
					if (new Date(a.time!).getTime() < new Date(b.time!).getTime())
						return 1;
					return 0;
				})
				.map(
					(announcement) =>
						announcement &&
						(announcement.type == AnnouncementType.ANNOUNCMENT ||
							announcement.type == AnnouncementType.CROSSPOST) && (
							<Announcement
								key={announcement.id + "other"}
								announcement={announcement as TypeOfAnnouncements}
								comments={
									recentlyPostedAnnouncements
										.concat(fetchedAnnouncements)
										.filter(
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
