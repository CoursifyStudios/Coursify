import {
	PaintBrushIcon,
	SwatchIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import Profile from "./pages/profile";
import { ReactNode } from "react";
import Theming from "./pages/theming";

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
		name: "Personalization",
		icon: <SwatchIcon className={iconClasses} />,
		content: <Theming />,
	},
	{
		name: "Third for testing",
		icon: <UserIcon className={iconClasses} />,
		content: <Profile />,
	},
	{
		name: "4th for testing",
		icon: <UserIcon className={iconClasses} />,
		content: <Profile />,
	},
];
