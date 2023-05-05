import {
	BellIcon,
	LockClosedIcon,
	SwatchIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import Profile from "./pages/profile";
import { ReactNode } from "react";
import Appearence from "./pages/appearence";
import Securityandprivacy from "./pages/securityandprivacy";

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
		name: "Appearence	",
		icon: <SwatchIcon className={iconClasses} />,
		content: <Appearence />,
	},
	{
		name: "Notifications",
		icon: <BellIcon className={iconClasses} />,
		content: <Profile />,
	},
	{
		name: "Security & Privacy",
		icon: <LockClosedIcon className={iconClasses} />,
		content: <Securityandprivacy />,
	},
];
