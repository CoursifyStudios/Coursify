export function dayPlus(day: Date, add: number) {
	const newDay = new Date(day.getTime());
	newDay.setDate(day.getDate() + add);
	return newDay;
}
