import { NextPage } from "next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { create } from "zustand";

import { Popup } from "@/components/misc/popup";
import { NewAssignmentData } from "@/lib/db/assignments/assignments";
import { useSettings } from "@/lib/stores/settings";
import { DueType } from "../assignments";
import AssignmentCreation from "./four";
import { submissionType } from "./submissionType";
import AssignmentSettings from "./three";
import AssignmentDetails from "./two";
import { getClassTimesForXDays } from "@/lib/db/classes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface AssignmentState {
	data: NewAssignmentData | undefined;
	set: (data: NewAssignmentData | undefined) => void;
}

export const useAssignmentStore = create<AssignmentState>()((set) => ({
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
	createTempAssignment: (value: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}) => void;
}> = ({
	open,
	setOpen,
	block,
	scheduleType,
	classid,
	createTempAssignment,
}) => {
	const { data: settings } = useSettings();
	const [stage, setStage] = useState(1);
	const { data: assignmentData, set: setAssignmentData } = useAssignmentStore();
	const supabase = useSupabaseClient();
	const [daysData, setDaysData] =
		useState<{ startTime: Date; endTime: Date }[]>();
	const [refreshState, refresher] = useState(1);
	const closeMenu = () => {
		setOpen(false);
		setStage(1);
		setAssignmentData(undefined);
		setAssignmentData(undefined);
	};

	useEffect(() => {
		(async () => {
			setDaysData(undefined);
			const classDays = await getClassTimesForXDays(
				supabase,
				{ block, type: scheduleType },
				new Date(),
				80
			);
			setDaysData(classDays);
		})();
	}, [refreshState, block, supabase, scheduleType]);

	return (
		<Popup open={open} closeMenu={() => closeMenu()}>
			{" "}
			<div className="w-full flex items-center">
				<div className="w-full z-10 grid h-8 w-8 place-items-center rounded-full bg-blue-500  font-semibold text-white">
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
					setStage={setStage}
					closeMenu={closeMenu}
					classid={classid}
					createTempAssignment={createTempAssignment}
					daysData={{
						data: daysData!,
						refresher: () => refresher(refreshState * -1),
					}}
				/>
			)}
		</Popup>
	);
	function AssignmentType() {
		if (stage != 1) return null;

		return (
			<>
				<h2 className="w-full title mt-6">Submission Type</h2>
				<div className="w-full mt-4 grid grid-cols-3 gap-5">
					{submissionType.map((submission, i) => (
						<div key={i}>
							<div
								className={` ${
									submission.grayscale
										? "grayscale cursor-not-allowed select-none"
										: "brightness-hover cursor-pointer"
								} h-full  rounded-md bg-gray-200 p-4 dark:border dark:bg-black `}
								onClick={
									submission.grayscale
										? undefined
										: () => {
												setAssignmentData({
													type: submission.type,
													dueType: DueType.START_OF_CLASS,
													publishType: DueType.START_OF_CLASS,
													hidden: false,
												} as NewAssignmentData);
												setStage((stage) => stage + 1);
										  }
								}
							>
								<div className="w-full flex items-center">
									<div className="w-full rounded-full bg-blue-500 p-2 text-white">
										{submission.icon}
									</div>
									<div className="w-full ml-3">
										<h1 className="w-full font-semibold">{submission.name}</h1>
										<p className="w-full test-gray-700 text-xs">
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
