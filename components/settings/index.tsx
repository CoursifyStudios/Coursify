import {
	BellIcon,
	LinkIcon,
	LockClosedIcon,
	SwatchIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import Profile from "./pages/profile";
import { ReactNode } from "react";
import Appearance from "./pages/appearance";
import Connections from "./pages/connections";
import Securityandprivacy from "./pages/securityPrivacy";

const iconClasses = "w-6 h-6";

export const settingsPages: {
	name: string;
	icon: ReactNode;
	content: ReactNode;
}[] = [
	{
		name: "Profile",
		icon: <UserIcon className={iconClasses} />,
		content: <Profile />,
	},
	{
		name: "Appearance	",
		icon: <SwatchIcon className={iconClasses} />,
		content: <Appearance />,
	},

	{
		name: "Notifications",
		icon: <BellIcon className={iconClasses} />,
		content: <Profile />,
	},
	{
		name: "Connections",
		icon: <LinkIcon className={iconClasses} />,
		content: <Connections />,
	},
	{
		name: "Security & Privacy",
		icon: <LockClosedIcon className={iconClasses} />,
		content: <Securityandprivacy />,
	},
];
