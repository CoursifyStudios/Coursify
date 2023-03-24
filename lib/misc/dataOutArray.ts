export const getDataOutArray = <T extends unknown>(data: T | T[]): T => {
	if (Array.isArray(data)) {
		return data[0];
	} else {
		return data;
	}
};

export const getDataInArray = <T extends unknown>(data: T | T[]): T[] => {
	if (Array.isArray(data)) {
		return data;
	} else {
		return [data];
	}
};
