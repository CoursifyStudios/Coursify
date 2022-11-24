import { useState } from "react";
import { useTabs } from "../lib/tabs/handleTabs";
import { ScheduleInterface } from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";

const Settings = () => {
	const tabs = useTabs((state) => state.tabs);
	const [tempSchedule, setTempSchedule] = useState<ScheduleInterface>();

	return <div className="grid grid-cols-2">will return to this tomorrow</div>;
};

export default Settings;
