import { useState } from "react";
import { Button } from "../misc/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createOrEditDefaultWeights } from "@/lib/db/weights";

export const WeightingUI = ({}: {}) => {
	const supabase = useSupabaseClient();
	const [weights, setWeights] = useState<{ name: string; value: number }[]>([]);
	const [currentWeight, setCurrentWeight] = useState<{
		name: string;
		value: number;
	}>({ name: "", value: 0 });
	const [showCreationUI, setShowCreationUI] = useState(false);
	return (
		<div className="py-2">
			<form
				name="form"
				onSubmit={(e) => {
					e.preventDefault();
					if (currentWeight.name && currentWeight.value) {
						setWeights(weights.concat(currentWeight));
					} else {
						//handle error here
					}
				}}
				className="flex space-x-3"
			>
				<label className="flex flex-col">
					<p>
						Name<span className="ml-1 text-red-500">*</span>
					</p>
					<input
						type="text"
						required
						onChange={(e) =>
							setCurrentWeight((currentWeight) => {
								return { ...currentWeight, name: e.target.value };
							})
						}
					/>
				</label>
				<label>
					<p>
						Percent<span className="ml-1 text-red-500">*</span>
					</p>
					<input
						type="number"
						max={100}
						min={1}
						step={1}
						required
						onChange={(e) =>
							setCurrentWeight({
								...currentWeight,
								value: parseInt(e.target.value),
							})
						}
					/>
				</label>
				<Button
					className="rounded-full"
					color="bg-gray-300 place-self-end h-10 "
					disabled={false}
					onClick={() => {}}
				>
					<PlusIcon className="h-5 w-5 dark:text-white" />
				</Button>
				<p className="text-red-500">* Required</p>
			</form>
			<div className="flex space-x-4 my-3">
				{weights.map((weight, i) => (
					<div
						key={i}
						className="bg-gray-200 select-none flex items-center justify-center flex-col rounded-md w-64 h-32"
					>
						<p className="text-xl font-semibold line-clamp-1">{weight.name}</p>
						<p className="text-lg">{weight.value}%</p>
					</div>
				))}
			</div>
			<Button
				onClick={() => createOrEditDefaultWeights(supabase, weights, "f")}
				color="bg-blue-500"
			>
				Save
			</Button>
		</div>
	);
};
