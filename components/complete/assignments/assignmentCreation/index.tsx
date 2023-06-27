import { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import { create } from "zustand";

import { NewAssignmentData } from "../../../../lib/db/assignments";
import { useSettings } from "../../../../lib/stores/settings";
import { Popup } from "../../../misc/popup";
import { DueType } from "../assignments";
import AssignmentCreation from "./four";
import { submissionType } from "./submissionType";
import AssignmentSettings from "./three";
import AssignmentDetails from "./two";

interface AssignmmentState {
	data: NewAssignmentData | undefined;
	set: (data: NewAssignmentData | undefined) => void;
}

export const useAssignmentStore = create<AssignmmentState>()((set) => ({
	data: undefined,
	set: (data) =>
		set((state) => ({
			data: data
				? ({ ...state.data, ...data } as NewAssignmentData)
				: undefined,
		})),
}));

export const CreateAssignment: NextPage<{
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	block: number;
	scheduleType: number;
	classid: string;
}> = ({ open, setOpen, block, scheduleType, classid }) => {
	const { data: settings } = useSettings();
	const [stage, setStage] = useState(1);
	const { data: assignmentData, set: setAssignmentData } = useAssignmentStore();

	const closeMenu = () => {
		setOpen(false);
		setStage(1);
		setAssignmentData(undefined);
		setAssignmentData(undefined);
	};

	return (
		<Popup open={open} closeMenu={() => closeMenu()}>
			{" "}
			<div className="flex items-center">
				<div className="z-10 grid h-8 w-8 place-items-center rounded-full bg-blue-500  font-semibold text-white">
					1
				</div>

				<div
					className={`-ml-2 h-2 w-36 ${
						stage == 1
							? "mr-8 bg-gradient-to-r from-blue-500 to-transparent"
							: " bg-blue-500 pr-8"
					} `}
				></div>

				<div
					className={`${
						stage == 1
							? "bg-backdrop dark:text-white"
							: " bg-blue-500 text-white"
					}  z-10 -ml-2 grid h-8 w-8 place-items-center rounded-full  font-semibold `}
				>
					2
				</div>
				<div
					className={`-ml-2 h-2 w-36 ${stage >= 3 && "bg-blue-500"} ${
						stage == 2 && "bg-gradient-to-r from-blue-500 to-transparent"
					}`}
				></div>

				<div
					className={`${
						stage < 3
							? "bg-backdrop dark:text-white"
							: " bg-blue-500 text-white"
					}  z-10 -ml-2 grid h-8 w-8 place-items-center rounded-full  font-semibold `}
				>
					3
				</div>
				<div
					className={`-ml-2 h-2 w-36 ${stage == 4 && "bg-blue-500"} ${
						stage == 3 && "bg-gradient-to-r from-blue-500 to-transparent"
					}`}
				></div>

				<div
					className={`z-10 grid h-8 w-8 ${
						stage == 4
							? " bg-blue-500 text-white"
							: "bg-backdrop dark:text-white"
					} -ml-2 place-items-center rounded-full  font-semibold`}
				>
					4
				</div>
			</div>
			<AssignmentType />
			<AssignmentDetails stage={stage} setStage={setStage} />
			<AssignmentSettings stage={stage} setStage={setStage} />
			{stage == 4 && (
				<AssignmentCreation
					block={block}
					scheduleType={scheduleType}
					setStage={setStage}
					closeMenu={closeMenu}
					classid={classid}
				/>
			)}
		</Popup>
	);
	function AssignmentType() {
		if (stage != 1) return null;

		return (
			<>
				<h2 className="title mt-6">Submission Type</h2>
				<div className="mt-4 grid grid-cols-3 gap-5">
					{submissionType.map((submission, i) => (
						<div key={i}>
							<div
								className={`brightness-hover h-full cursor-pointer rounded-md bg-gray-200 p-4 dark:border dark:bg-black `}
								onClick={() => {
									setAssignmentData({
										type: submission.type,
										dueType: DueType.START_OF_CLASS,
										publishType: DueType.START_OF_CLASS,
										hidden: false,
									} as NewAssignmentData);
									setStage((stage) => stage + 1);
								}}
							>
								<div className="flex items-center">
									<div className="rounded-full bg-blue-500 p-2 text-white">
										{submission.icon}
									</div>
									<div className="ml-3">
										<h1 className="font-semibold">{submission.name}</h1>
										<p className="test-gray-700 text-xs">
											{submission.description}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</>
		);
	}
};
