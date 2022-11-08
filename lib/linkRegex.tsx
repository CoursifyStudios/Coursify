import create from "zustand";
import { Tab } from "../components/layout/navbar";
import { persist } from "zustand/middleware";

function getLinkRegex(route: string): { matcher: RegExp; name: string } | null {
	const pageMatchers: { matcher: RegExp; name: string }[] = [
		{ matcher: /^\/settings/g, name: "Settings" },
	];

	pageMatchers.forEach((v) => {
		if (v.matcher.test(route)) return v;
	});
	return null;
}

export const useTabs = create<{
	tabs: Tab[];
	newTab: (route: string) => void;
}>()(
	persist((set) => ({
		tabs: [
			{
				name: "test",
				matcher: /amongus/,
				route: "/amongus",
			},
		],
		newTab: (tab) => {
			const newTab = getLinkRegex(tab);
			if (newTab == null) return;

			set((state) => ({
				tabs: state.tabs.concat([
					{
						//this is soooo jank
						route: tab,
						name: newTab.name,
						matcher: newTab.matcher,
					},
				]),
			}));
		},
	}))
);
