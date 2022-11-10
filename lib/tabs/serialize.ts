import { Tab } from "../../components/layout/navbar";

export function serializeTabs(tabs: Tab[]) {
	const newTabs = tabs.map((tab) => {
		return {
			...tab,
			matcher: { flags: tab.matcher.flags, source: tab.matcher.source },
		};
	});
	return newTabs;
}

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
