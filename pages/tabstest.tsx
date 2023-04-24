import { NextPage } from "next";
import { useTabs } from "../lib/tabs/handleTabs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getSchedulesForXDays } from "../lib/db/schedule";

const Settings: NextPage = () => {
	const tabs = useTabs((state) => state.tabs);
	const supabase = useSupabaseClient();
	return (
		<div className=" flex flex-col items-start">
			Testing tabs
			<button
				onClick={async () =>
					console.log(
						await getSchedulesForXDays(supabase, new Date(2023, 1, 2), 60)
					)
				}
			>
				PRESS ME{" "}
			</button>
		</div>
	);
};

export default Settings;
