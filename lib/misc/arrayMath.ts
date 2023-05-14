export const average = (numbs: number[]) => {
	return numbs.reduce((a, b) => a + b, 0) / numbs.length;
};

export const median = (numbs: number[]) => {
	return numbs.length % 2 === 0
		? (numbs.slice().sort((a, b) => a - b)[numbs.length / 2 - 1] +
				numbs.slice().sort((a, b) => a - b)[numbs.length / 2]) /
				2
		: numbs.slice().sort((a, b) => a - b)[Math.floor(numbs.length / 2)];
};

export const middle50 = (numbs: number[]) => {
	return [...numbs]
		.sort((a, b) => a - b)
		.slice(Math.floor(numbs.length * 0.25), Math.ceil(numbs.length * 0.75));
};
