import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { Database } from "../../../lib/db/database.types";
import { NewAssignmentData } from "../../../lib/db/assignments";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { getDaysInMonth } from "../../../lib/misc/dates";
import { getClassTimesForXDays } from "../../../lib/db/classes";

const AssignmentCalender: NextPage<{
	block: number;
	scheduleType: number;
	setAssignmentData: Dispatch<SetStateAction<NewAssignmentData | undefined>>;
	type: "due" | "publish";
}> = ({ block, scheduleType, setAssignmentData }) => {
	const supabase = useSupabaseClient<Database>();
	const [daysData, setDaysData] = useState<Date[]>();
	const [selectedDay, setSelectedDay] = useState<number>();

	const refreshData = async () => {
		setDaysData(undefined);
		const classDays = await getClassTimesForXDays(
			supabase,
			{ block, type: scheduleType },
			new Date(),
			80
		);
		console.log(classDays);
		setDaysData(classDays);
	};

	useEffect(() => {
		if (!daysData) refreshData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{daysData ? (
				<div className="scrollbar-fancy mt-2 flex max-h-56 flex-wrap gap-2 overflow-auto">
					{fillArrayWithDates(new Date(), 80).map((date, i) => (
						<>
							{(i == 0 || date.getDate() == 1) && (
								<h2 className="w-full text-lg font-medium">
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
										: "cursor-not-allowed text-gray-600"
								}
								${selectedDay == i && "border border-gray-300 bg-white shadow"}
								`}
								onClick={() => setSelectedDay(i)}
							>
								{date.getDate()}
							</div>
						</>
					))}
				</div>
			) : (
				"loadiung"
			)}
		</>
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

const years = [new Date().getFullYear(), new Date().getFullYear() + 1];

export default AssignmentCalender;
