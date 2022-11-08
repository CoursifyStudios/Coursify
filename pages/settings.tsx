import { NextPage } from "next";
import { useTabs } from "../lib/linkRegex";

const Settings: NextPage = () => {
	const tabs = useTabs((state) => state.tabs);
	return (
		<div>
			Settings
			{JSON.stringify(tabs)}
		</div>
	);
};

export default Settings;
