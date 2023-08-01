import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useTabs } from "../lib/tabs/handleTabs";
import { NextPageWithLayout } from "./_app";
import Layout from "@/components/layout/layout";
import { ReactElement } from "react";

const Settings: NextPageWithLayout = () => {
	const tabs = useTabs((state) => state.tabs);
	const supabase = useSupabaseClient();
	return (
		<div className=" flex flex-col items-start">
			Testing tabs
			<button
			// onClick={async () =>
			// 	console.log(
			// 		await getSchedulesForXDays(supabase, new Date(2023, 1, 2), 60)
			// 	)
			// }
			>
				PRESS ME{" "}
			</button>
		</div>
	);
};

export default Settings;

Settings.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};
