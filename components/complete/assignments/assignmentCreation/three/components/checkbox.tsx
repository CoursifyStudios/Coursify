import CMenu from "@/components/misc/menu";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	EllipsisVerticalIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { AssignmentTypes } from "../../../../../../lib/db/assignments";
import { AssignmentCheckoff } from "../settings.types";

const CheckBox = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentCheckoff;
		setSettings: Dispatch<SetStateAction<AssignmentCheckoff>>;
	};
}) => {
	useLayoutEffect(() => {
		if (settings == undefined)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.CHECKOFF,
				checkboxes: [
					{
						name: "Complete",
						description: "Assignment is completed",
						step: 0,
						teacher: false,
					},
				],
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (settings == undefined) return null;

	return (
		<>
			<div
				className="group flex grow cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-2 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
				onClick={() => {
					setSettings((s) => {
						const checks = s.checkboxes;

						checks.unshift({
							name: "New Checkbox",
							description: "Checkbox Description",
							teacher: false,
							step: checks.length,
						});

						return {
							...s,
							checkboxes: checks,
						};
					});
				}}
			>
				<PlusIcon className="-ml-4 mr-4 h-8 w-8 transition group-hover:scale-125" />{" "}
				<h3 className="text-lg font-medium transition">New Checkbox</h3>
			</div>{" "}
			{settings.checkboxes.map((checkbox, i) => (
				<Check checkbox={checkbox} key={i} i={i} />
			))}
			<p className="text-sm italic text-gray-700">
				Edit a field by clicking on the corresponding text
			</p>
		</>
	);

	function Check({
		checkbox,
		i,
	}: {
		checkbox: AssignmentCheckoff["checkboxes"][number];
		i: number;
	}) {
		const [titleSelected, setTitleSelected] = useState(false);
		const [descSelected, setDescSelected] = useState(false);
		return (
			<div className="flex rounded-xl border border-white/10 px-3 py-2">
				<div className="mr-5 flex flex-col justify-between ">
					<button
						className={`${
							i == 0 ? "text-gray-300" : "text-gray-800"
						} my-auto rounded-md p-0.5 hover:bg-gray-200`}
						onClick={() => {
							if (i == 0) return;
							setSettings((s) => {
								const checks = s.checkboxes;
								const temp = checks[i];
								checks[i] = checks[i - 1];
								checks[i - 1] = temp;
								return {
									...s,
									checkboxes: checks,
								};
							});
						}}
					>
						<ChevronUpIcon className="h-4 w-4 stroke-2" />
					</button>
					<div className="bg-neutral-960 my-1 h-5 w-5 rounded border-2"></div>
					<button
						className={`${
							i == settings.checkboxes.length - 1
								? "text-gray-300"
								: "text-gray-800"
						} my-auto rounded-md p-0.5 hover:bg-gray-200`}
						onClick={() => {
							if (i == settings.checkboxes.length - 1) return;
							setSettings((s) => {
								const checks = s.checkboxes;
								const temp = checks[i];
								checks[i] = checks[i + 1];
								checks[i + 1] = temp;
								return {
									...s,
									checkboxes: checks,
								};
							});
						}}
					>
						<ChevronDownIcon className="h-4 w-4 stroke-2" />
					</button>
				</div>
				<div className="flex grow flex-col">
					<input
						type="text"
						defaultValue={checkbox.name}
						className={`${
							titleSelected
								? ""
								: "noinputcss border-transparent bg-transparent"
						} px-2 py-0.5 font-medium focus:select-all`}
						onFocus={() => {
							setTitleSelected(true);
						}}
						onBlur={(e) => {
							setTitleSelected(false);
							setSettings((s) => ({
								// [1, {1}]
								...s,
								checkboxes: [
									...s.checkboxes.slice(0, i),
									{ ...checkbox, name: e.currentTarget.value },
									...s.checkboxes.slice(i + 1),
								],
							}));
						}}
					/>
					<input
						type="text"
						defaultValue={checkbox.description}
						className={`${
							descSelected ? "" : "noinputcss border-transparent bg-transparent"
						} mt-2 px-2 py-0.5 text-sm focus:select-all`}
						onFocus={() => {
							setDescSelected(true);
						}}
						onBlur={(e) => {
							setDescSelected(false);
							setSettings((s) => ({
								...s,
								checkboxes: [
									...s.checkboxes.slice(0, i),
									{ ...checkbox, description: e.currentTarget.value },
									...s.checkboxes.slice(i + 1),
								],
							}));
						}}
					/>
				</div>
				<CMenu
					items={[
						{
							content: (
								<div>
									<h3>Teacher Only</h3>
									<p className="text-xs font-normal">
										Only teachers can select this checkbox
									</p>
								</div>
							),
							className: `text-left !p-2 ${
								checkbox.teacher && "brightness-focus border "
							}`,
							onClick: () =>
								setSettings((s) => ({
									...s,
									checkboxes: [
										...s.checkboxes.slice(0, i),
										{ ...checkbox, teacher: !checkbox.teacher },
										...s.checkboxes.slice(i + 1),
									],
								})),
						},
					]}
				>
					<button className="my-auto ml-2 rounded-md px-0.5 py-1 hover:bg-gray-200">
						<EllipsisVerticalIcon className="h-6 w-6" />
					</button>
				</CMenu>
			</div>
		);
	}
};

export default CheckBox;
