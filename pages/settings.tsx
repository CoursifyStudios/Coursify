import { NextPage } from "next";
import { useTabs } from "../lib/handleTabs";

const Settings: NextPage = () => {
	const tabs = useTabs((state) => state.tabs);
	return <div>Settings</div>;
};

export default Settings;
