import { useState } from "react";
import { Popup } from "../misc/popup";
import { Button } from "../misc/button";
import { deleteAgenda } from "@/lib/db/classes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const DeleteAgenda = ({
	open,
	setOpen,
	agendaID,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
	agendaID: string;
}) => {
	const supabase = useSupabaseClient();
	const [errorMessage, setErrorMessage] = useState("");
	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="xs">
			<p>
				Are you sure you want to delete the agenda? This action is permanent!
			</p>
			<div className="flex justify-evenly mt-2">
				<Button color="bg-blue-500" onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<Button
					color="bg-red-500"
					onClick={async () => {
						const DBreturn = await deleteAgenda(supabase, agendaID);
						if (DBreturn.error) {
							setErrorMessage(
								"Something went wrong deleting your agenda. Try again later"
							);
						} else {
							setErrorMessage("");
							setOpen(false);
						}
					}}
				>
					Confirm
				</Button>
			</div>
			<p className="text-red-500">{errorMessage}</p>
		</Popup>
	);
};
