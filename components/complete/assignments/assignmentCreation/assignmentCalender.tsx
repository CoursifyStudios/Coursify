import { NextPage } from "next";
import { NewAssignmentData } from "../../../../lib/db/assignments";
import { useAssignmentStore } from ".";
import { DueType } from "../assignments";

const AssignmentCalender: NextPage<{
	daysData: { startTime: Date; endTime: Date }[] | undefined;
	type: "due" | "publish";
}> = ({ daysData, type }) => {
	const { setAssignmentData, assignmentData } = useAssignmentStore((state) => ({
		setAssignmentData: state.set,
		assignmentData: state.data,
	}));

	const updateAssignmentData = (date: Date, day: number) => {
		if (!daysData) return;

		const data = daysData.find(
			(day) =>
				day.startTime.toISOString().slice(0, 10) ==
				date.toISOString().slice(0, 10)
		);
		// makes sure users don't click on days they aren't supposed to
		if (!data) return;

		if (type == "due") {
			switch (assignmentData?.dueType) {
				case DueType.START_OF_CLASS:
					setAssignmentData({
						dueDate: data.startTime,
						dueDay: day,
					} as NewAssignmentData);
				case DueType.END_OF_CLASS:
					setAssignmentData({
						dueDate: data.endTime,
						dueDay: day,
					} as NewAssignmentData);
			}
		}
		if (type == "publish") {
			switch (assignmentData?.dueType) {
				case DueType.START_OF_CLASS:
					setAssignmentData({
						publishDate: data.startTime,
						publishDay: day,
					} as NewAssignmentData);
				case DueType.END_OF_CLASS:
					setAssignmentData({
						publishDate: data.endTime,
						publishDay: day,
					} as NewAssignmentData);
			}
		}
	};

	if (!assignmentData) return null;

	return (
		<div
			className={`scrollbar-fancy relatiive mt-2 flex h-56 flex-wrap gap-2 overflow-auto`}
		>
			{daysData
				? fillArrayWithDates(new Date(), 80).map((date, i) => (
						<>
							{(i == 0 || date.getDate() == 1) && (
								<h2
									className="sticky top-0 z-10 w-full bg-[#f2f2f2] text-lg font-medium dark:bg-[#070707]"
									key={i + "title"}
								>
									{date.toLocaleString("default", { month: "long" })}
								</h2>
							)}
							<div
								key={i}
								className={`grid h-10 w-10 place-items-center rounded-lg font-medium 
								${
									daysData.find(
										(day) =>
											day.startTime.toISOString().slice(0, 10) ==
											date.toISOString().slice(0, 10)
									)
										? " brightness-hover cursor-pointer bg-gray-300"
										: "cursor-not-allowed text-gray-500"
								}
								${
									(type == "due"
										? assignmentData.dueDay
										: assignmentData.publishDay) == i &&
									"border border-gray-300 bg-white shadow"
								}
								`}
								onClick={() => updateAssignmentData(date, i)}
							>
								{date.getDate()}
							</div>
						</>
				  ))
				: [...new Array(28)].map((_, i) => (
						<div
							className="h-10 w-10 animate-pulse rounded bg-gray-200"
							key={i}
						></div>
				  ))}
		</div>
	);
};

function fillArrayWithDates(date: Date, numDays: number) {
	const output: Date[] = [];

	for (let i = 0; i < numDays; i++) {
		output.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return output;
}

export default AssignmentCalender;
