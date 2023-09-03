import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DragZone, DropZone } from "../misc/draggableUI";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "../misc/button";
import { randomUUID } from "crypto";
import { ColoredPill } from "../misc/pill";
import { Period } from "./periods";

export const GradingPeriodUI = ({
	school,
	previousPeriods,
	editing,
}: {
	school: string;
	previousPeriods: {
		end_date?: string;
		id?: string;
		name?: string;
		parent?: string;
		school?: string;
		start_date: string;
		weight?: number;
	}[];
	editing?: boolean;
}) => {
	const supase = useSupabaseClient();
	const [currentPeriod, setCurrentPeriod] = useState<{
		end_date?: string;
		id?: string;
		name?: string;
		parent?: string;
		school?: string;
		start_date?: string;
		weight?: number;
	}>();
	const [periods, setPeriods] = useState<
		{
			end_date?: string;
			id?: string;
			name?: string;
			parent?: string;
			school?: string;
			start_date?: string;
			weight?: number;
		}[]
	>(previousPeriods);
	return (
		<div className="py-2">
			<h2 className="font-semibold text-lg mb-2">Adjust grading periods</h2>
			<PeriodForm setter={setPeriods} />
			{/* <button onClick={() => console.log(periods)}>Test</button> */}
			{periods.map(
				(period) =>
					!period.parent && (
						<Period
							key={period.id}
							period={period}
							modifyPeriods={setPeriods}
							deleteMe={(ids) => {
								setPeriods(
									periods.filter((aPeriod) => ids.indexOf(aPeriod.id!) == -1)
								);
							}}
							setPeriods={setPeriods}
						/>
					)
			)}
		</div>
	);
};

export const PeriodForm = ({
	setter,
	info,
}: {
	setter: Dispatch<
		SetStateAction<
			{
				end_date?: string;
				id?: string;
				name?: string;
				parent?: string;
				school?: string;
				start_date?: string;
				weight?: number;
			}[]
		>
	>;
	info?: {
		end_date?: string;
		id?: string;
		name?: string;
		parent?: string;
		school?: string;
		start_date?: string;
		weight?: number;
	};
}) => {
	const [currentPeriod, setCurrentPeriod] = useState<
		| {
				end_date?: string;
				id?: string;
				name?: string;
				parent?: string;
				school?: string;
				start_date?: string;
				weight?: number;
		  }
		| undefined
	>(info);
	return (
		<form
			className="flex space-x-3 p-2"
			onSubmit={(e) => {
				e.preventDefault();
				if (currentPeriod)
					setter((periods) =>
						periods.concat({ id: crypto.randomUUID(), ...currentPeriod })
					);
			}}
		>
			<label className="flex flex-col">
				Name
				<input
					type="text"
					required
					onChange={(e) =>
						setCurrentPeriod({ ...currentPeriod, name: e.target.value })
					}
				></input>
			</label>
			<label className="flex flex-col">
				Weight
				<input
					type="number"
					max={100}
					min={1}
					step={1}
					required
					onChange={(e) =>
						setCurrentPeriod({
							...currentPeriod,
							weight: parseInt(e.target.value),
						})
					}
				></input>
			</label>
			<label className="flex flex-col">
				Start Date
				<input
					type="date"
					onChange={(e) =>
						setCurrentPeriod({ ...currentPeriod, start_date: e.target.value })
					}
					className="bg-backdrop/50 dark:placeholder:text-gray-400"
				></input>
			</label>
			<label className="flex flex-col">
				End Date
				<input
					type="date"
					onChange={(e) =>
						setCurrentPeriod({ ...currentPeriod, end_date: e.target.value })
					}
					className="bg-backdrop/50 dark:placeholder:text-gray-400"
				></input>
			</label>
			<Button
				className="rounded-full"
				color="bg-gray-300 h-10 p-5 place-self-end"
			>
				<PlusIcon className="h-5 w-5 dark:text-white" />
			</Button>
		</form>
	);
};
