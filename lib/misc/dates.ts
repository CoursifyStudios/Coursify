export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
};

export const howLongAgo = (date: string) => {
	const seconds =
		(Date.now() - new Date(date).getTime()) / 1000 -
		new Date().getTimezoneOffset() * 60 -
		3600;

	var interval = seconds / 31536000;

	if (interval > 2) {
		return Math.floor(interval) + " years ago";
	}
	interval = seconds / 2592000;
	if (interval > 2) {
		return Math.floor(interval) + " months ago";
	}
	interval = seconds / 86400;
	if (interval > 2) {
		return Math.floor(interval) + " days ago";
	}
	interval = seconds / 3600;
	if (interval > 2) {
		return Math.floor(interval) + " hours ago";
	}
	interval = seconds / 60;
	if (interval > 2) {
		return Math.floor(interval) + " minutes ago";
	}
	//Using math.max to stop the -1 seconds ago thing
	return Math.max(Math.floor(seconds), 0) + " seconds ago";
};

export function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}
