import { useState } from "react";
import { Popup } from "../../misc/popup";
import { Button } from "../../misc/button";
import { deleteAgenda } from "@/lib/db/agendas";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LoadingSmall } from "../../misc/loading";

export const DeleteAgenda = ({
	open,
	setOpen,
	agendaID,
	completed,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
	agendaID: string;
	completed: (value: boolean) => void;
}) => {
	const supabase = useSupabaseClient();
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="xs">
			<p>
				Are you sure you want to delete the agenda? This action is permanent!
			</p>
			<div className="w-full flex justify-evenly mt-2">
				<Button color="bg-blue-500" onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<Button
					className="w-full gap-2"
					color="bg-red-500"
					onClick={async () => {
						setLoading(true);
						const DBreturn = await deleteAgenda(supabase, agendaID);
						if (DBreturn.error) {
							setLoading(false);
							setErrorMessage(
								"Something went wrong deleting your agenda. Try again later"
							);
						} else {
							setLoading(false);
							setErrorMessage("");
							completed(true);
							setOpen(false);
						}
					}}
				>
					Confirm {loading && <LoadingSmall />}
				</Button>
			</div>
			<p className="w-full text-red-500">{errorMessage}</p>
		</Popup>
	);
};
