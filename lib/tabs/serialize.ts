import { Tab } from "../../components/layout/navbar";

/**
 * Get tabs ready for serializing
 * @param tabs Array of the tabs that need to be serialized
 * @returns A ready to be serialized version of the tabs
 */
export function serializeTabs(tabs: Tab[]) {
	const newTabs = tabs.map((tab) => {
		return {
			...tab,
			matcher: { flags: tab.matcher.flags, source: tab.matcher.source },
		};
	});
	return newTabs;
}

/**
 * Get tabs ready for use after deserializing
 * @param tabs Array of the tabs that were just deserialized
 * @returns Tabs that can not be used with the rest of the helper functions
 */
export function deserializeTabs(tabs: Tab[]) {
	//const newTabs: Tab[] = []
	const newTabs = tabs.map((tab) => {
		return {
			...tab,
			matcher: new RegExp(tab.matcher.source, tab.matcher.flags),
		};
	});
	return newTabs;
}
