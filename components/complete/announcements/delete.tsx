import { NextPage } from "next";
import { Popup } from "../../misc/popup";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../lib/db/database.types";
import { Button } from "../../misc/button";
import { useState } from "react";
import {
	TypeOfAnnouncements,
	deleteAnnouncement,
	removeAnnouncementFromCommunity,
} from "../../../lib/db/announcements";
import { LoadingSmall } from "../../misc/loading";

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
			classID
		);
		if (data.error) {
			setError(data.error.message);
			setDeleting(undefined);
		} else setDeleted(true);
	};

	const deleteMultiple = async () => {
		setDeleting("multiple");
		const data = await deleteAnnouncement(supabase, {
			author: announcement.author,
			title: announcement.title!,
			time: announcement.time!,
		});
		if (data.error) {
			setError(data.error.message);
			setDeleting(undefined);
		} else setDeleted(true);
	};

	return (
		<Popup closeMenu={() => setOpen(false)} open={open} small={true}>
			<h2 className="title-sm">Delete Announcement</h2>
			<div className="mb-4 mt-2">
				Are you sure you want to delete this announcement? This action cannot be undone.
                To delete announcement from all groups, select Delete All.
			</div>
			{error && (
				<div className="font-medium">
					Error: <span className="text-red-700">{error}</span>
				</div>
			)}
			<div className="mt-2 flex justify-between">
				<Button>Cancel</Button>
				<div className="flex">
					<Button onClick={deleteSingle} disabled={deleting != undefined}>
						{deleting == "single" ? (
							<>
								Deleting <LoadingSmall className="ml-2" />
							</>
						) : (
							"Delete All"
						)}{" "}
					</Button>
					<Button
						onClick={deleteMultiple}
						disabled={deleting != undefined}
						className="ml-4"
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
