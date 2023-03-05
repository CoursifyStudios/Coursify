export const addPossesive: (toChange: string) => string = (toChange) => {
	if (toChange.endsWith("s")) {
		return toChange + "'";
	} else {
		return toChange + "'s";
	}
};
