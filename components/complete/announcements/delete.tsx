import { SupabaseClient } from "@supabase/supabase-js";
import { NextPage } from "next";
import { useState } from "react";
import {
	AnnouncementType,
	TypeOfAnnouncements,
	deleteAnnouncement,
	removeAnnouncementFromCommunity,
} from "../../../lib/db/announcements";
import { Database } from "../../../lib/db/database.types";
import { Button } from "../../misc/button";
import { LoadingSmall } from "../../misc/loading";
import { Popup } from "../../misc/popup";

export const Delete: NextPage<{
	open: boolean;
	setOpen: (value: boolean) => void;
	supabase: SupabaseClient<Database>;
	setDeleted: (value: boolean) => void;
	announcement: TypeOfAnnouncements;
	classID: string;
}> = ({ setOpen, supabase, open, setDeleted, announcement, classID }) => {
	const [deleting, setDeleting] = useState<string>();
	const [error, setError] = useState<string>();

	const deleteSingle = async () => {
		setDeleting("single");
		const data = await removeAnnouncementFromCommunity(
			supabase,
			announcement.id,
			classID,
			//only delete the files if this is a lone announcement.
			//This strategy sort of falls apart if you post announcements to
			//many groups and then delete them individually, but other than
			//an SQL function I see no easy way to do this
			// the sql function would just check that nothing references the file
			announcement.clone_id == null && announcement.files
				? announcement.files.map((file) => `announcements/${file.dbName}`)
				: []
		);
		if (data.error) {
			setError(data.error.message);
			setDeleting(undefined);
		} else setDeleted(true);
	};
	const deleteMultiple = async () => {
		setDeleting("multiple");
		const data = await deleteAnnouncement(supabase, {
			id: announcement.id,
			author: announcement.author,
			title: announcement.title!,
			files: announcement.files
				? announcement.files.map((file) => `announcements/${file.dbName}`)
				: [],
			clone_id: announcement.clone_id,
		});
		if (data.error) {
			setError(data.error.message);
			setDeleting(undefined);
		} else setDeleted(true);
	};

	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="sm">
			<h2 className="title-sm">Delete Announcement</h2>
			<div className="mb-4 mt-2">
				{announcement.type == AnnouncementType.ANNOUNCEMENT ||
				announcement.type == AnnouncementType.CROSSPOST
					? "Are you sure you want to delete this announcement? This action cannot be undone. To delete announcement from all groups, select Delete All."
					: "Are you sure that you want to delete this comment? This action cannot be undone"}
			</div>
			{error && (
				<div className="font-medium">
					Error: <span className="text-red-700">{error}</span>
				</div>
			)}
			<div className="mt-2 flex justify-between">
				<Button
					onClick={() => setOpen(false)}
					className=" focus:outline-1 focus:outline-black" //Make this UI better later
				>
					Cancel
				</Button>
				<div className="flex">
					{(announcement.type == AnnouncementType.ANNOUNCEMENT ||
						announcement.type == AnnouncementType.CROSSPOST) && (
						<Button
							className=" focus:outline-1 focus:outline-black" //Make this UI better later
							onClick={deleteMultiple}
							disabled={deleting != undefined || announcement.clone_id == null}
						>
							{deleting == "multiple" ? (
								<>
									Deleting <LoadingSmall className="ml-2" />
								</>
							) : (
								"Delete All"
							)}{" "}
						</Button>
					)}

					<Button
						onClick={deleteSingle}
						disabled={deleting != undefined}
						className="ml-4 focus:outline-1 focus:outline-black" //Make this UI better later
						color="bg-red-700 text-white"
					>
						{deleting == "single" ? (
							<>
								Deleting <LoadingSmall className="ml-2" />
							</>
						) : (
							"Delete"
						)}
					</Button>
				</div>
			</div>
		</Popup>
	);
};
