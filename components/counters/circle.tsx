import type { NextPage } from "next";

const CircleCounter: NextPage<{
	amount?: number | null;
	max: number;
	small?: boolean;
}> = ({ amount, max, small }) => {
	const percent = (amount ? (amount > 100 ? 100 : amount) : 0) / max;
	return (
		<div className={`relative ${small ? "h-6 w-6" : "h-10 w-10"}`}>
			<div className="absolute inset-0">
				<svg
					className="aspect-square rotate-90"
					// style="--stroke: 12"
					// :style="'--val: ' + getPercentage(user.xp)"
					viewBox="0 0 120 120"
				>
					<circle
						className="stroke-green-200/50 stroke-[number:12]"
						cx="60"
						cy="60"
						r="48"
						fill="none"
					/>
					<circle
						className="stroke-green-500 stroke-[number:calc(1+12)] transition-[stroke-dashoffset] duration-500 [stroke-dasharray:100]"
						strokeDashoffset={100 - percent * 100}
						cx="60"
						cy="60"
						strokeLinecap="round"
						r="48"
						fill="none"
						pathLength="100"
					/>
				</svg>
			</div>
			{small ? (
				<></>
			) : (
				<div className="grid h-full place-items-center font-medium leading-[0.7]">
					{amount && amount.toFixed(0).slice(0, 3)}
				</div>
			)}
		</div>
	);
};

export default CircleCounter;
