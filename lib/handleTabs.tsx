import create from "zustand";
import { Tab } from "../components/layout/navbar";
import { persist } from "zustand/middleware";

export const useTabs = create<{
	tabs: Tab[];
	newTab: (route: string) => void;
	closeTab: (matcher: RegExp) => void;
}>()(
	persist(
		(set) => ({
			tabs: [],
			newTab: (tab) => {
				const newTab = getLinkRegex(tab);
				if (newTab == null) return;
				set((state) => {
					if (state.tabs.find((tab) => tab.name == newTab.name)) {
						return { tabs: state.tabs };
					} else {
						return {
							tabs: state.tabs.concat([
								// 0 clue as to why push doesn't work here
								newTab,
							]),
						};
					}
				});
			},
			closeTab: (tabMatcher) => {
				set((state) => {
					const index = state.tabs.findIndex(
						(tab) => tab.matcher == tabMatcher
					);
					if (index == -1) return { tabs: state.tabs };
					else {
						const newArr = JSON.parse(JSON.stringify(state.tabs));
						const toReturn = newArr.splice(index, 1);
						console.log(newArr, index);
						return {
							tabs: newArr,
						};
					}
				});
			},
		}),
		{
			name: "tabs-storage",
			getStorage: () => sessionStorage,
		}
	)
);

function getLinkRegex(route: string): Tab | null {
	const pageMatchers: { matcher: RegExp; name: string }[] = [
		// List of all links, their regex, then the name of the page
		{ matcher: /^\/settings/g, name: "Settings" },
		{ matcher: /^\/tabstest/g, name: "Testing tabs but this name is rly long" },
	];
	let test: Tab | null = null;
	pageMatchers.forEach((v) => {
		if (v.matcher.test(route)) {
			test = {
				route,
				...v,
			};
		}
	});
	return test;
}

//FOR TESTING:

interface BearState {
	bears: number;
	increase: (by: number) => void;
}

export const useBearStore = create<BearState>()((set) => ({
	bears: 0,
	increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
