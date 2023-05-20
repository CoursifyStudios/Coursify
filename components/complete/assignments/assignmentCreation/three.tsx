import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useAssignmentStore } from ".";
import { NewAssignmentData } from "../../../../lib/db/assignments";
import { getClassTimesForXDays } from "../../../../lib/db/classes";
import { Database, Json } from "../../../../lib/db/database.types";
import Editor from "../../../editors/richeditor";
import { Button } from "../../../misc/button";
import Dropdown from "../../../misc/dropdown";
import { LoadingSmall } from "../../../misc/loading";
import { Toggle } from "../../../misc/toggle";
import { Info } from "../../../tooltips/info";
import { DueType } from "../assignments";
import AssignmentCalender from "./assignmentCalender";

const AssignmentCreation: NextPage<{
	setStage: Dispatch<SetStateAction<number>>;
	block: number;
	scheduleType: number;
	classid: string;
	closeMenu: () => void;
}> = ({ setStage, block, scheduleType, closeMenu, classid }) => {
	const supabase = useSupabaseClient<Database>();
	const [selectedDueType, setSelectedDueType] = useState(types[0]);
	const [selectedPublishType, setSelectedPublishType] = useState(types[0]);
	const [publish, setPublished] = useState(false);
	const [due, setDue] = useState(true);
	const [daysData, setDaysData] =
		useState<{ startTime: Date; endTime: Date }[]>();
	const [submitting, setSubmitting] = useState<boolean>();
	const [error, setError] = useState("");

	const { setAssignmentData, assignmentData } = useAssignmentStore((state) => ({
		setAssignmentData: state.set,
		assignmentData: state.data,
	}));

	const setType = (type: { type: DueType; name: string }, due: boolean) => {
		if (due) {
			setSelectedDueType(type);
			setAssignmentData({ dueType: type.type } as NewAssignmentData);
		} else {
			setSelectedPublishType(type);
			setAssignmentData({ publishType: type.type } as NewAssignmentData);
		}
	};

	const refreshData = async () => {
		setDaysData(undefined);
		const classDays = await getClassTimesForXDays(
			supabase,
			{ block, type: scheduleType },
			new Date(),
			80
		);
		setDaysData(classDays);
	};

	const canCreate = useMemo(() => {
		if (
			assignmentData &&
			(due ? assignmentData.dueType && assignmentData.dueDate : true) &&
			(publish
				? assignmentData.publishType && assignmentData.publishDate
				: true)
		) {
			return true;
		}
		return false;
	}, [assignmentData, due, publish]);

	const createAssignment = async () => {
		if (!assignmentData) {
			setError("AssignmentData not found");
			return;
		}
		setSubmitting(true);
		const data: Database["public"]["Tables"]["assignments"]["Insert"] = {
			class_id: classid,
			content: assignmentData.content as unknown as Json,
			description: assignmentData.description,
			name: assignmentData.name,
			submission_instructions: assignmentData.submissionInstructions,
			submission_type: assignmentData.submissionType,
			hidden: assignmentData.hidden,
		};
		if (due) {
			data.due_date = assignmentData.dueDate?.toISOString();
			data.due_type = assignmentData.dueType;
		}
		if (publish) {
			data.publish_date = assignmentData.publishDate?.toISOString();
			data.publish_type = assignmentData.publishType;
		}
		const { error } = await supabase.from("assignments").insert(data);
		setSubmitting(false);
		if (error) {
			setError(error.message);
			setSubmitting(undefined);
			return;
		}
		setTimeout(closeMenu, 500);
	};

	useEffect(() => {
		if (!daysData) refreshData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<section className="mt-6 flex flex-col">
				{assignmentData && (
					<>
						<h2 className="text-xl font-bold">{assignmentData.name}</h2>
						<p className="mt-2 text-gray-700">
							<span className="font-medium text-gray-800">
								Short description:{" "}
							</span>
							{assignmentData.description}
						</p>
						{assignmentData.submissionType && (
							<p className="mt-3 text-gray-700">
								<span className="font-medium text-gray-800">
									Submission Instructions:{" "}
								</span>
								{assignmentData.submissionType}
							</p>
						)}
					</>
				)}

				{assignmentData?.content &&
					/* @ts-expect-error lexical-bad-typings */
					assignmentData?.content?.root.children[0].children.length > 0 && (
						<>
							<span className="mt-3 font-medium text-gray-800">
								Full Length Description:{" "}
							</span>

							<Editor
								editable={false}
								initialState={assignmentData.content}
								className="scrollbar-fancy max-h-[30vh] overflow-y-auto"
							/>
						</>
					)}
			</section>

			<hr className="my-4" />

			<section className="grid grid-cols-2 gap-4">
				<div className="flex flex-col">
					<div className="flex justify-between">
						<p className="mb-2 font-medium text-gray-800">Set a Publish Date</p>
						<Toggle enabled={publish} setEnabled={setPublished} />
					</div>
					{publish ? (
						<WhenDue type="publish" />
					) : (
						<div className="text-sm text-gray-700">
							Auto publishing is disabled. This assignment will be available to
							your students immediately.
						</div>
					)}
				</div>
				<div className="flex flex-col">
					<div className="flex justify-between">
						<p className="mb-2 font-medium text-gray-800 ">Set a Due Date</p>
						<Toggle enabled={due} setEnabled={setDue} />
					</div>
					{due ? (
						<WhenDue type="due" />
					) : (
						<div className="text-sm text-gray-700">
							This assignment does not have a due date. It will be avalible to
							students, and they{"'"}ll be able to submit assignments. Coursify
							reccomends adding a due date.
						</div>
					)}
				</div>
			</section>

			{error && (
				<section className="mt-2 font-semibold">
					Error: <span className="text-red-700">{error}</span>
				</section>
			)}

			<section className="mt-6 flex items-center justify-between space-x-4">
				<div className="flex items-center font-medium">
					<span className="mr-2 text-gray-800">Hidden</span>
					<Info className=" mr-4">
						Hide this assignment from students. We reccomend setting a publish
						date rather than enabling this option, since you can automagiclly
						make it avalible to students at a time of your choice.
					</Info>
					{assignmentData && (
						<Toggle
							enabled={assignmentData?.hidden}
							setEnabled={(v) =>
								setAssignmentData({ hidden: v } as NewAssignmentData)
							}
						/>
					)}
				</div>
				<div className="flex space-x-4">
					<span onClick={() => setStage((stage) => stage - 1)}>
						<Button>Prev</Button>
					</span>

					<span onClick={createAssignment}>
						<Button
							color="bg-blue-500"
							className="text-white "
							disabled={!canCreate || submitting || submitting == false}
						>
							{submitting ? (
								<>
									Creating <LoadingSmall className="ml-2" />
								</>
							) : submitting == false ? (
								"Created!"
							) : (
								"Create"
							)}
						</Button>
					</span>
				</div>
			</section>
		</>
	);
	async function onDateChange(event: ChangeEvent<HTMLInputElement>) {
		setAssignmentData({
			dueType: DueType.DATE,
			dueDate: new Date(event.target.value),
		} as NewAssignmentData);
	}

	function WhenDue({ type }: { type: "due" | "publish" }) {
		return (
			<>
				<Dropdown
					onChange={(value) => setType(value, type == "due")}
					selectedValue={type == "due" ? selectedDueType : selectedPublishType}
					values={types}
					className="mr-auto"
				/>
				{type == "due" &&
					(selectedDueType.type == DueType.DATE ? (
						<input
							type="datetime-local"
							className="mt-4 rounded-md border-gray-300  bg-white/50 focus:ring-1"
							onChange={onDateChange}
						/>
					) : (
						<AssignmentCalender type="due" daysData={daysData} />
					))}

				{type == "publish" &&
					(selectedPublishType.type == DueType.DATE ? (
						<input
							type="datetime-local"
							className="mt-4 rounded-md border-gray-300  bg-white/50 focus:ring-1"
						/>
					) : (
						<AssignmentCalender type="publish" daysData={daysData} />
					))}
			</>
		);
	}
};

export const types: { type: DueType; name: string }[] = [
	{
		type: DueType.START_OF_CLASS,
		name: "Start of class",
	},
	{
		type: DueType.END_OF_CLASS,
		name: "End of class",
	},
	{
		type: DueType.DATE,
		name: "Custom date",
	},
];

export default AssignmentCreation;
