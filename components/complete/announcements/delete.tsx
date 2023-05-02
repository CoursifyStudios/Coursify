import { NextPage } from "next";
import { Popup } from "../../misc/popup";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../lib/db/database.types";

export const Delete: NextPage<{
	open: boolean;
	setOpen: (value: boolean) => void;
	supabase: SupabaseClient<Database>;
	setDeleted: (value: boolean) => void;
}> = ({setOpen, supabase, open, setDeleted}) => {
	return (
		<Popup closeMenu={() => setOpen(false)} open={open}>
			<div>Content</div>
		</Popup>
	);
};

