import { NextPage } from "next";

const LineCounter: NextPage<{
	amount: number;
	max?: number;
	color?: "green" | "yellow" | "red";
}> = ({ amount, max = 100, color = "green" }) => {
	return (
		<div className="w-full flex h-1 w-full rounded-full bg-green-200/50 dark:bg-green-950">
			<div
				className="w-full rounded-full bg-gradient-to-r from-green-600 via-green-600 to-green-500 transition-all"
				style={{ width: `${(amount / max) * 100}%` }}
			></div>
		</div>
	);
};

export default LineCounter;
