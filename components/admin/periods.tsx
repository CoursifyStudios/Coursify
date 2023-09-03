import { Button } from "../misc/button";
import { TrashIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import {
	Dispatch,
	ReactInstance,
	SetStateAction,
	useRef,
	useState,
} from "react";
import { PeriodForm } from "./semesters";

export const Period = ({
	period,
	modifyPeriods,
	deleteMe,
	deleteMeFromMyParent,
	setPeriods,
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
	deleteMe: (ids: string[]) => void;
	deleteMeFromMyParent?: (id: string) => void;
	setPeriods: Dispatch<
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
}) => {
	const reference = useRef<HTMLDivElement>(null);
	const [editing, setEditing] = useState(false);
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
	const [currentPeriod, setCurrentPeriod] = useState<{
		end_date?: string;
		id?: string;
		name?: string;
		parent?: string;
		school?: string;
		start_date?: string;
		weight?: number;
	}>(period);

	return (
		<div
			ref={reference}
			className="outline-1 outline group relative rounded-md p-1 grow m-1"
		>
			{editing ? (
				<PeriodForm setter={setPeriods} info={period} />
			) : (
				<div className="flex flex-col items-center justify-center p-4">
					<p className="text-xl font-semibold line-clamp-1">{period.name}</p>
					<p className="text-lg">{period.weight}%</p>
					<p>
						{new Date(period.start_date!).toLocaleDateString("en-US")} -{" "}
						{new Date(period.end_date!).toLocaleDateString("en-US")}
					</p>
				</div>
			)}
			<Button
				color="flex grow bg-red-500/25 absolute top-2 right-2 hover:bg-red-500/40 hover:bg-gray-300"
				onClick={() => {
					deleteMe([period.id!, ...childPeriods.map((p) => p.id!)]);
					if (deleteMeFromMyParent) {
						deleteMeFromMyParent(period.id!);
					}
				}}
			>
				<TrashIcon className="w-4 h-4" />
			</Button>
			<Button
				color="flex grow bg-gray-500/25 absolute top-2 right-16 hover:bg-gray-500/40 hover:bg-gray-300"
				onClick={() => {
					setEditing(!editing);
				}}
			>
				<PencilIcon className="w-4 h-4" />
			</Button>
			<Button
				className="absolute bottom-2 right-2"
				onClick={() => setEditing(true)}
			>
				<PlusIcon className="h-5 w-4" />
			</Button>

			<div className="flex">
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
						setPeriods={setPeriods}
					/>
				))}
			</div>
		</div>
	);
};
