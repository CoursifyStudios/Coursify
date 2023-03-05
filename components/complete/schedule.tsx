import Link from "next/link";
import { AllClassesResponse } from "../../lib/db/classes";
import {
	ScheduleData,
	ScheduleInterface,
	to12hourTime,
} from "../../lib/db/schedule";
import { ColoredPill } from "../misc/pill";

export default function ScheduleComponent({
	schedule,
	classes,
}: {
	schedule: ScheduleInterface[] | undefined;
	classes: AllClassesResponse | undefined;
}) {
	if (!(schedule && classes))
		return (
			<div className="mt-6 flex h-36 animate-pulse flex-col justify-between rounded-xl bg-gray-200 p-4">
				<div className="flex justify-between">
					<div className="h-5 w-36 animate-pulse rounded bg-gray-300"></div>
					<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
				</div>
				<div className="flex justify-between">
					<div className="h-5 w-32 animate-pulse rounded bg-gray-300"></div>
					<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
				</div>
				<div className="flex justify-between">
					<div className="h-5 w-36 animate-pulse rounded bg-gray-300"></div>
					<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
				</div>
			</div>
		);
	return (

	return (
		<div className="flex flex-col">
			<div className=" mt-6 grid max-w-md gap-5 rounded-xl bg-gray-200 p-4">
				{/* I've left some comments to clear up some stuff */}
				{schedule && //checks if the useState that stores the schedule UI is not null
					schedule.data && //checks if the data on the schedule thing exists
					schedule.data.schedule_items && //checks if there are schedule items on the data thing on the schedule thing
					Array.isArray(schedule.data.schedule_items) &&
					(schedule.data?.schedule_items as unknown as ScheduleInterface[])
						/* Pretty sure that the line above makes sure that we are iterating over an array of ScheduleInterfaces, 
                            and not of "schedule_items", which is not a type that we can use to populate the UI directly. I think.*/
						.map(
							(item, index) =>
								(checkClassMatchesSchedule(item)?.name &&
									/* checks that item (a ScheduleInterface) matches to a class, (see the function), and that the name attribute on it is not null */
									!item.specialEvent && ( //If the item is not a special event... ...fill the UI with the stuff...
										<Link
											key={index}
											className="flex grow items-center justify-between font-semibold"
											href={
												"/classes/" + checkClassMatchesSchedule(item)?.id //link to the correct class
											}
										>
											{
												classes?.data?.find(
													/* Here we check that the schedule and classes match up, using a slightly different process to the one used by checkClassMatchesSchedule). */
													(v) =>
														v.block == item.block &&
														v.schedule_type == item.type
												)?.name // And we fill in the UI with the name
											}
											<ColoredPill
												color={
													//@ts-ignore WHY THE HELL DOES IT THINK THAT IT CAN JUST DO THAT TO ME
													checkClassMatchesSchedule(item).color
												}
											>
												{to12hourTime(item.timeStart)} -{" "}
												{to12hourTime(item.timeEnd)}
											</ColoredPill>
										</Link>
									)) ||
								(item.specialEvent &&
									checkClassMatchesSchedule(item) && ( // If the schedule item is for a special event, fill the UI with custom event stuff
										// May want to change this to be a <Link> later on so that you can link to info about special events

										<div className="flex grow items-center justify-between font-semibold">
											{item.specialEvent}
											<ColoredPill
												color={item.customColor ? item.customColor : "green"}
											>
												{to12hourTime(item.timeStart)} -{" "}
												{to12hourTime(item.timeEnd)}
											</ColoredPill>
										</div>
									))
						)}
			</div>
		</div>
	);
	function checkClassMatchesSchedule(scheduleItem: ScheduleInterface) {
		return classes?.data?.find(
			(v) =>
				v.block == scheduleItem.block && v.schedule_type == scheduleItem.type
		);
	}
}
