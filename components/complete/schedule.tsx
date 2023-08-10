import Link from "next/link";
import { AllClasses, AllClassesResponse } from "../../lib/db/classes";
import {
	ScheduleInterface,
	handleTimezone,
	to12hourTime,
} from "../../lib/db/schedule";
import { ColoredPill } from "../misc/pill";
import { useSettings } from "@/lib/stores/settings";

export default function ScheduleComponent({
	schedule,
	classes,
}: {
	schedule: ScheduleInterface[] | undefined;
	classes: AllClasses | undefined;
}) {
	const { data: settings } = useSettings();

	if (!(schedule && classes))
		return (
			<div className="my-5 flex h-36 animate-pulse flex-col justify-between rounded-xl bg-backdrop-200 p-4">
				{[...Array(3)].map((_, i) => (
					<div className="flex justify-between" key={i}>
						<div className="h-5 w-36 animate-pulse rounded bg-gray-300"></div>
						<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
					</div>
				))}
			</div>
		);
	return (
		<div className="flex flex-col">
			<div className="my-4 grid max-w-md gap-5 rounded-xl bg-backdrop-200 p-4 compact:my-2 compact:gap-2">
				{/* I've left some comments to clear up some stuff */}
				{schedule && //checks if the useState that stores the schedule UI is not null
					schedule.map(
						(item, index) =>
							(checkClassMatchesSchedule(item) &&
								// @ts-expect-error I give up
								checkClassMatchesSchedule(item).class!.name &&
								/* checks that item (a ScheduleInterface) matches to a class, (see the function), and that the name attribute on it is not null */
								!item.specialEvent && ( //If the item is not a special event... ...fill the UI with the stuff...
									<Link
										key={index}
										className="flex grow items-center justify-between font-semibold"
										href={
											"/classes/" +
											(checkClassMatchesSchedule(item)
												? // @ts-expect-error
												  checkClassMatchesSchedule(item).class!.id
												: "") //link to the correct class
										}
									>
										{
											classes.find(
												/* Here we check that the schedule and classes match up, using a slightly different process to the one used by checkClassMatchesSchedule). */
												(v) =>
													v.class &&
													v.class.block == item.block &&
													v.class.schedule_type == item.type
											)?.class!.name // And we fill in the UI with the name
										}
										<ColoredPill
											color={
												//@ts-ignore WHY THE HELL DOES IT THINK THAT IT CAN JUST DO THAT TO ME
												checkClassMatchesSchedule(item).class.color
											}
										>
											{to12hourTime(
												handleTimezone(item.timeStart),
												settings.showAMPM
											)}{" "}
											-{" "}
											{to12hourTime(
												handleTimezone(item.timeEnd),
												settings.showAMPM
											)}
										</ColoredPill>
									</Link>
								)) ||
							(item.specialEvent &&
								checkClassMatchesSchedule(item) && ( // If the schedule item is for a special event, fill the UI with custom event stuff
									// May want to change this to be a <Link> later on so that you can link to info about special events

									<div
										className="flex grow items-center justify-between font-semibold"
										key={index}
									>
										{item.specialEvent}
										<ColoredPill
											color={item.customColor ? item.customColor : "green"}
										>
											{to12hourTime(
												handleTimezone(item.timeStart),
												settings.showAMPM
											)}{" "}
											-{" "}
											{to12hourTime(
												handleTimezone(item.timeEnd),
												settings.showAMPM
											)}
										</ColoredPill>
									</div>
								))
					)}
			</div>
		</div>
	);
	function checkClassMatchesSchedule(scheduleItem: ScheduleInterface) {
		return (
			Array.isArray(classes) &&
			classes?.find(
				(v) =>
					v.class!.block == scheduleItem.block &&
					v.class!.schedule_type == scheduleItem.type
			)
		);
	}
}
