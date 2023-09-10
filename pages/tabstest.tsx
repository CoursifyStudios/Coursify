import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useTabs } from "../lib/tabs/handleTabs";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import Layout from "@/components/layout/layout";
import { ReactElement } from "react";

const Settings: NextPageWithLayout = () => {
	const tabs = useTabs((state) => state.tabs);
	const supabase = useSupabaseClient();
	const [test, setTest] = useState(false);

	useEffect(() => {
		//console.log("rerender")
	});

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
			<Testing test={test} setTest={setTest} />
		</div>
	);
};

export default Settings;

Settings.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

function Testing({
	setTest,
	test,
}: {
	test: boolean;
	setTest: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return <div onClick={() => setTest(true)}>click {test && "among"}</div>;
}
