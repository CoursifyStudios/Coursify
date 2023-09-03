import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../misc/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createOrEditDefaultWeights } from "@/lib/db/admin/weights";
import { LoadingSmall } from "../misc/loading";

export const WeightingUI = ({
	school,
	previousWeights,
}: {
	school: string;
	previousWeights: { id: string; name: string; value: number }[] | null;
}) => {
	const supabase = useSupabaseClient();
	const [weights, setWeights] = useState<
		{ id: string; name: string; value: number }[]
	>([]);

	useEffect(() => {
		if (weights.length == 0 && previousWeights) setWeights(previousWeights);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previousWeights]);
	const [saving, setSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [currentWeight, setCurrentWeight] = useState<{
		id: string;
		name: string;
		value: number;
	}>({ id: "", name: "", value: 0 });
	const [showCreationUI, setShowCreationUI] = useState(false);

	return (
		<div className="py-2">
			<h2 className="font-semibold text-lg mb-2">Default Weights</h2>
			<form
				name="form"
				onSubmit={(e) => {
					e.preventDefault();
					if (currentWeight.name && currentWeight.value) {
						setWeights(
							weights.concat({ ...currentWeight, id: crypto.randomUUID() })
						);
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
				>
					<PlusIcon className="h-5 w-5 dark:text-white" />
				</Button>
			</form>
			<div className="flex space-x-4 my-3">
				{weights.map((weight) => (
					<Weight key={weight.id} weight={weight} setWeights={setWeights} />
				))}
			</div>
			<Button
				onClick={async () => {
					setErrorMessage("");
					setSaving(true);
					const response = await createOrEditDefaultWeights(
						supabase,
						weights,
						school
					);
					setSaving(false);
					if (typeof response === "string") {
						setErrorMessage(response);
					} else if (response.error) {
						setErrorMessage(
							response.error.details +
								response.error.hint +
								response.error.message
						);
					} else {
						//success state
					}
				}}
				color="bg-blue-500"
			>
				Save{saving && <LoadingSmall className="ml-3" />}
			</Button>
			<p className="text-red-500">{errorMessage}</p>
		</div>
	);
};

const Weight = ({
	weight,
	setWeights,
}: {
	weight: { id: string; name: string; value: number };
	setWeights: Dispatch<
		SetStateAction<{ id: string; name: string; value: number }[]>
	>;
}) => {
	const [editing, setEditing] = useState(false);
	const [info, setInfo] = useState<{ id: string; name: string; value: number }>(
		weight
	);
	return (
		<div className="bg-gray-200 flex items-center justify-center flex-col rounded-md w-64 h-32 group relative">
			{editing ? (
				<>
					<input
						type="text"
						className="w-56 h-8 font-semibold text-xl text-center"
						value={info.name}
						onChange={(e) => setInfo({ ...weight, name: e.target.value })}
					></input>
					<input
						type="number"
						className="w-24 h-8 text-lg dark:text-white text-center"
						value={info.value}
						onChange={(e) =>
							setInfo({ ...weight, value: parseInt(e.target.value) })
						}
					></input>
				</>
			) : (
				<>
					<p className="text-xl font-semibold line-clamp-1">{info.name}</p>
					<p className="text-lg">{info.value}%</p>
				</>
			)}
			{!editing ? (
				<Button
					onClick={() => setEditing(true)}
					className="brightness-hover absolute right-2 bottom-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold opacity-0 group-hover:opacity-100"
				>
					Edit
				</Button>
			) : (
				<Button
					onClick={() => {
						setEditing(false);
						setWeights((weights) =>
							weights.map((aWeight) =>
								aWeight.id == weight.id ? info : aWeight
							)
						);
					}}
					className="brightness-hover absolute bottom-2 right-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold "
				>
					Save
				</Button>
			)}
			<Button
				color="flex grow bg-red-500/25 hover:bg-red-500/40 hover:bg-gray-300 brightness-hover absolute top-2 right-2 opacity-0 group-hover:opacity-100"
				onClick={() => {
					setWeights((weights) =>
						weights.filter((aWeight) => aWeight.id != weight.id)
					);
				}}
			>
				<TrashIcon className="w-4 h-4" />
			</Button>
		</div>
	);
};
