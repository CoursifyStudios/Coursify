import { Tab } from "../../components/layout/navbar";

const pageMatchers: { matcher: RegExp; name: string }[] = [
	// List of all links, their regex, then the name of the page
	{ matcher: /^\/settings/g, name: "Settings" },
	{ matcher: /^\/tabstest/g, name: "Testing tabs but this name is rly long" },
	{ matcher: /^\/profile/g, name: "Name's Profile" },
];

/**
 * Get the regex of a given route
 * @param route A valid route on the website
 * @returns The tab representation of the sent route
 */
export function getLinkRegex(route: string): Tab | null {
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
