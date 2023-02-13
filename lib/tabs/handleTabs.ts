import { create } from "zustand";
import { Tab } from "../../components/layout/navbar";
import { createJSONStorage, persist } from "zustand/middleware";
import { deserialize, serialize } from "v8";
import { deserializeTabs, serializeTabs } from "./serialize";
import { getLinkRegex } from "./linkRegex";

export const useTabs = create<{
	/** The currently opened tabs */
	tabs: Tab[];
	/** Create a new tab by passing a valid route */
	newTab: (route: string, name?: string) => void;
	/** Close a new tab by passing a valid name of an opened tab */
	closeTab: (name: string) => void;
}>()(
	persist(
		(set) => ({
			tabs: [],
			newTab: (tab, name) => {
				let newTab = getLinkRegex(tab);
				if (newTab == null && name) {
					newTab = {
						name: name,
						route: tab,
					};
				}
				if (newTab == null) return;

				set((state) => {
					if (state.tabs.find((tab) => tab.name == newTab?.name)) {
						return { tabs: state.tabs };
					} else {
						return {
							tabs: state.tabs.concat([
								// 0 clue as to why push doesn't work here
								//@ts-ignore-error
								newTab,
							]),
						};
					}
				});
			},
			closeTab: (name) => {
				set((state) => {
					const index = state.tabs.findIndex((tab) => tab.name == name);
					if (index == -1) return { tabs: state.tabs };
					else {
						const newArr = deserializeTabs(
							JSON.parse(JSON.stringify(serializeTabs(state.tabs)))
						);
						newArr.splice(index, 1);

						return {
							tabs: newArr,
						};
					}
				});
			},
		}),
		{
			name: "tabs-storage",
			storage: {
				getItem: (name) => {
					const str = sessionStorage.getItem(name);
					if (str == null) return null;
					const state = JSON.parse(str);

					return {
						...state,
						state: {
							...state.state,
							tabs: deserializeTabs(state.state.tabs),
						},
					};
				},
				setItem: (name, newValue) => {
					//const str = sessionStorage.getItem(name)
					const newTabs = JSON.stringify({
						...newValue,
						state: {
							...newValue.state,
							tabs: serializeTabs(newValue.state.tabs),
						},
					});

					sessionStorage.setItem(name, newTabs);
				},
				removeItem: (name) => sessionStorage.removeItem(name),
			},
		}
	)
);

//FOR TESTING:

interface BearState {
	bears: number;
	increase: (by: number) => void;
}

export const useBearStore = create<BearState>()((set) => ({
	bears: 0,
	increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
