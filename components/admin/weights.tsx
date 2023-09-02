import { useState } from "react";
import { Button } from "../misc/button";
import { PlusIcon } from "@heroicons/react/24/outline";

export const WeightingUI = ({}: {}) => {
	const [weights, setWeights] = useState<{ name: string; value: number }[]>([]);
	const [showCreationUI, setShowCreationUI] = useState(false);
	return (
		<div className="py-2">
			<form
				name="form"
				onSubmit={(e) => {
					e.preventDefault();
					//console.log(new FormData(form));
					//console.log(Object.fromEntries(new FormData(e.currentTarget).values()));
				}}
				className="flex space-x-3"
			>
				<label className="flex flex-col">
					<p>
						Name<span className="ml-1 text-red-500">*</span>
					</p>
					<input type="text" required />
				</label>
				<label>
					<p>
						Percent<span className="ml-1 text-red-500">*</span>
					</p>
					<input type="number" max={100} min={1} step={1} required />
				</label>
				<Button
					className="rounded-full"
					color="bg-gray-300 place-self-end h-10 "
					disabled={false}
					onClick={() => {}}
				>
					<PlusIcon className="h-5 w-5 dark:text-white" />
				</Button>
				* Required
			</form>
			{weights.map((weight, index) => (
				<div key={index}>Test</div>
			))}
		</div>
	);
};
