import { SupabaseClient } from "@supabase/supabase-js";
import { CoursifyFile } from "../files/genericFileUpload";
import { Database } from "@/lib/db/database.types";
import { Popup } from "../misc/popup";
import { useState } from "react";
import { Button } from "../misc/button";
import { LoadingSmall } from "../misc/loading";
import { deleteListing } from "@/lib/db/textbooks";

export const Delete = ({
	open,
	setOpen,
	supabase,
	setDeleted,
	pictures,
	id,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
	supabase: SupabaseClient<Database>;
	setDeleted: (value: boolean) => void;
	pictures: string[];
	id: string;
}) => {
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string>();

	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="sm">
			<h2 className="title-sm">Are you sure you wish to delete the listing?</h2>
			<div className="mt-2 flex justify-between">
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button
					color="bg-red-700 text-white"
					onClick={async () => {
						setError("");
						setDeleting(true);
						const dBReturn = await deleteListing(supabase, id, pictures);
						setDeleting(false);
						if (dBReturn.error) {
							setError(dBReturn.error.message);
						} else if (dBReturn.data) {
							setDeleted(true);
							setOpen(false);
						}
					}}
				>
					{deleting ? (
						<>
							Deleting <LoadingSmall className="ml-2" />
						</>
					) : (
						"Delete"
					)}
				</Button>
			</div>
			<p className="text-red-500">{error}</p>
		</Popup>
	);
};
