export const addPossessive: (toChange: string) => string = (toChange) => {
	if (toChange.endsWith("s")) {
		return toChange + "'";
	} else {
		return toChange + "'s";
	}
};
