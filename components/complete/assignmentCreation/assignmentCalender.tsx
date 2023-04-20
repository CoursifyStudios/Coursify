import { NextPage } from "next";
import { NewAssignmentData } from "../../../lib/db/assignments";
import { useAssignmentStore } from ".";

const AssignmentCalender: NextPage<{
	daysData: Date[] | undefined;
	type: "due" | "publish";
}> = ({ daysData, type }) => {
	const { setAssignmentData, assignmentData } = useAssignmentStore((state) => ({
		setAssignmentData: state.set,
		assignmentData: state.data,
	}));

	const updateAssignmentData = (date: Date, day: number) => {
		if (type == "due") {
			setAssignmentData({ dueDate: date, dueDay: day } as NewAssignmentData);
		}
		if (type == "publish") {
			setAssignmentData({
				publishDate: date,
				publishDay: day,
			} as NewAssignmentData);
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
									className="sticky top-0 z-10 w-full bg-[#f2f2f2] text-lg font-medium"
									key={i + "title"}
								>
									{date.toLocaleString("default", { month: "long" })}
								</h2>
							)}
							<div
								key={i}
								className={`grid h-10 w-10 place-items-center rounded-lg  font-medium 
								${
									daysData.find(
										(day) =>
											day.toISOString().slice(0, 10) ==
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
