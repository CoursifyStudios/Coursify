export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
	}).format(date);
};

// function timeAgo(date: Date) {
// 	const formatter = new Intl.RelativeTimeFormat('en');
// 	const ranges = {
//     years: 3600 * 24 * 365,
//     months: 3600 * 24 * 30,
//     weeks: 3600 * 24 * 7,
//     days: 3600 * 24,
//     hours: 3600,
//     minutes: 60,
//     seconds: 1
//   };
//   const secondsElapsed = (date.getTime() - Date.now()) / 1000;
//   for (let key in ranges) {
//     if (ranges[key] < Math.abs(secondsElapsed)) {
//       const delta = secondsElapsed / ranges[key];
//       return formatter.format(Math.round(delta), key);
//     }
//   }

//  }

export const howLongAgo = (date: string) => {
	const seconds =
		(Date.now() - new Date(date).getTime()) / 1000 -
		new Date().getTimezoneOffset() * 60 -
		3600;

	let interval = seconds / 31536000;

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
