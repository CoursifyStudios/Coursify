import { NextPage } from "next";
import { useTabs } from "../lib/tabs/handleTabs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getSchedulesForMonth } from "../lib/db/schedule";
import { getDaysForClassInMonth } from "../lib/db/classes";

const Settings: NextPage = () => {
	const tabs = useTabs((state) => state.tabs);
	const supabase = useSupabaseClient();
	return (
		<div className=" flex flex-col items-start">
			Testing tabs
			<button
				onClick={async () =>
					console.log(await getSchedulesForMonth(supabase, 2, 2023))
				}
			>
				PRESS ME{" "}
			</button>
			<button
				onClick={async () =>
					console.log(
						await getDaysForClassInMonth(
							supabase,
							{ block: 1, type: 1 },
							2,
							2023
						)
					)
				}
			>
				try this
			</button>
		</div>
	);
};

export default Settings;
