import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tab } from "../../components/layout/navbar";
import { getLinkRegex } from "./linkRegex";
import { deserializeTabs, serializeTabs } from "./serialize";

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
			// sets the initial state for tabs
			tabs: [],
			// adds a new tab to the list of tabs
			newTab: (tab, name) => {
				let newTab = getLinkRegex(tab);
				// if the tab doesn't match the link regex and a name is provided, creates a new tab
				if (newTab == null && name) {
					newTab = {
						name: name,
						route: tab,
					};
				}
				// returns if the newTab is null
				if (newTab == null) return;

				// sets the new state with the newly added tab, or returns the current state if the tab already exists
				set((state) => {
					if (state.tabs.find((tab) => tab.name == newTab?.name)) {
						return { tabs: state.tabs };
					} else {
						return {
							// 0 clue as to why push doesn't work here
							//@ts-ignore-error
							tabs: state.tabs.concat([newTab]),
						};
					}
				});
			},
			// removes a tab from the list of tabs
			closeTab: (name) => {
				set((state) => {
					const index = state.tabs.findIndex((tab) => tab.name == name);
					// returns the current state if the tab doesn't exist
					if (index == -1) return { tabs: state.tabs };
					else {
						// creates a new array without the removed tab
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
		// persists the state to session storage
		{
			name: "tabs-storage",
			storage: {
				getItem: (name) => {
					const str = sessionStorage.getItem(name);
					// returns null if the item doesn't exist in session storage
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
