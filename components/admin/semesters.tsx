import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
	Dispatch,
	ReactInstance,
	SetStateAction,
	useRef,
	useState,
} from "react";
import { DragZone, DropZone } from "../misc/draggableUI";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../misc/button";
import { randomUUID } from "crypto";

export const GradingPeriodUI = ({
	school,
	previousPeriods,
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
		<>
			<h2 className="font-semibold text-lg mb-2">Adjust grading periods</h2>
			<form
				className="flex space-x-3"
				onSubmit={(e) => {
					e.preventDefault();
					if (currentPeriod)
						setPeriods(
							periods.concat({ id: crypto.randomUUID(), ...currentPeriod })
						);
				}}
			>
				<label className="grid">
					Name
					<input
						type="text"
						required
						onChange={(e) =>
							setCurrentPeriod({ ...currentPeriod, name: e.target.value })
						}
					></input>
				</label>
				<label className="grid">
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
				<label>
					Start Date
					<input
						type="date"
						onChange={(e) =>
							setCurrentPeriod({ ...currentPeriod, start_date: e.target.value })
						}
						className="bg-backdrop/50 dark:placeholder:text-gray-400"
					></input>
				</label>
				<label>
					End Date
					<input
						type="date"
						onChange={(e) =>
							setCurrentPeriod({ ...currentPeriod, end_date: e.target.value })
						}
						className="bg-backdrop/50 dark:placeholder:text-gray-400"
					></input>
				</label>
				<Button className="rounded-full" color="bg-gray-300 h-10 p-5">
					<PlusIcon className="h-5 w-5 dark:text-white" />
				</Button>
			</form>
			{periods
				// .map((period, i) => {
				// 	return {
				// 		children: periods
				// 			.filter((potentialChild) => potentialChild.parent == period.id)
				// 			.map((period) => period.id),
				// 		...period,
				// 	};
				// })
				.map(
					(period) =>
						!period.parent && (
							<Period
								key={period.id}
								period={period}
								modifyPeriods={setPeriods}
								deleteMe={(id) => {
									setPeriods(periods.filter((aPeriod) => aPeriod.id != id));
								}}
							/>
						)
				)}
		</>
	);
};

const Period = ({
	period,
	modifyPeriods,
	deleteMe,
	deleteMeFromMyParent,
}: {
	period: {
		end_date?: string;
		id?: string;
		name?: string;
		parent?: string;
		school?: string;
		start_date?: string;
		weight?: number;
	};
	modifyPeriods: Dispatch<
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
	deleteMe: (id: string) => void;
	deleteMeFromMyParent?: (id: string) => void;
}) => {
	const reference = useRef<HTMLDivElement>(null);

	const [showAvailableSlot, setShowAvailableSlot] = useState(false);
	const [childPeriods, setChildPeriods] = useState<
		{
			end_date?: string;
			id?: string;
			name?: string;
			parent?: string;
			school?: string;
			start_date?: string;
			weight?: number;
		}[]
	>([]);

	return (
		<div
			ref={reference}
			className="outline-1 outline rounded-md p-1"
			draggable={true}
			onDragStart={(e) => {
				e.dataTransfer.setDragImage(reference.current as Element, 0, 0);
				//e.dataTransfer.setData("coursifydraggableelement", "")
				e.dataTransfer.setData("period", JSON.stringify(period));
			}}
			//Now onto the landing zone stuff
			//previews
			onDragOver={(e) => {
				e.preventDefault();
				if (
					e.dataTransfer.types.includes("period") &&
					(
						JSON.parse(e.dataTransfer.getData("period")) as unknown as {
							end_date?: string;
							id?: string;
							name?: string;
							parent?: string;
							school?: string;
							start_date?: string;
							weight?: number;
						}
					).id != period.id
				) {
					setShowAvailableSlot(true);
				}
			}}
			onDragLeave={() => setShowAvailableSlot(false)}
			//actual shiz
			onDrop={(e) => {
				const child = JSON.parse(
					e.dataTransfer.getData("period")
				) as unknown as {
					end_date?: string;
					id?: string;
					name?: string;
					parent?: string;
					school?: string;
					start_date?: string;
					weight?: number;
				};
				if (e.dataTransfer.types.includes("period") && child.id != period.id) {
					setShowAvailableSlot(false);
					setChildPeriods(
						childPeriods.concat({
							...child,
							parent: period.id,
						})
					);
					if (modifyPeriods) {
						modifyPeriods((periods) =>
							periods.map((aPeriod) =>
								aPeriod.id == child.id
									? {
											...child,
											parent: period.id,
									  }
									: aPeriod
							)
						);
					}
				}
			}}
		>
			<p
				className="text-red-500 ml-auto"
				onClick={() => {
					deleteMe(period.id!);
					if (deleteMeFromMyParent) {
						deleteMeFromMyParent(period.id!);
					}
				}}
			>
				X
			</p>
			<p>{period.name}</p>
			<p>{period.weight}</p>
			<p>
				{period.start_date}-{period.end_date}
			</p>
			{childPeriods.map((child) => (
				<Period
					key={child.id}
					period={child}
					modifyPeriods={modifyPeriods}
					deleteMe={deleteMe}
					deleteMeFromMyParent={(id) =>
						setChildPeriods((childPeriods) =>
							childPeriods.filter((aChild) => aChild.id != id)
						)
					}
				/>
			))}
			{showAvailableSlot && <div className="w-32 h-16 bg-gray-200 p-5"></div>}
		</div>
	);
};
