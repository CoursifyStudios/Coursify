import Link from "next/link";
import { AllClassesResponse } from "../../lib/db/classes";
import { Database } from "../../lib/db/database.types";
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
	schedule: ScheduleData;
	classes: AllClassesResponse;
}) {
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
export function timeOfClass(
	classToUse: Database["public"]["Tables"]["classes"]["Row"],
	schedule: ScheduleInterface[],
	use12hourTime?: boolean
) {
	if (
		use12hourTime &&
		schedule?.find(
			(v) => v.block == classToUse.block && v.type == classToUse.schedule_type
		)
	) {
		return (
			to12hourTime(
				//@ts-ignore why
				schedule?.find(
					(v) =>
						v.block == classToUse.block && v.type == classToUse.schedule_type
				)?.timeStart
			) +
			" - " +
			to12hourTime(
				//@ts-ignore why
				schedule?.find(
					(v) =>
						v.block == classToUse.block && v.type == classToUse.schedule_type
				)?.timeEnd
			)
		);
	} else {
		return (
			schedule?.find(
				(v) => v.block == classToUse.block && v.type == classToUse.schedule_type
			)?.timeStart +
			" - " +
			schedule?.find(
				(v) => v.block == classToUse.block && v.type == classToUse.schedule_type
			)?.timeEnd
		);
	}
}
export function sortClassesByTime (classes: Database["public"]["Tables"]["classes"]["Row"][], schedule: ScheduleData, use12hourTime: boolean) {
    if (schedule == undefined) return undefined;
    return classes.sort((a, b) => {
        //@ts-expect-error
        if ((schedule as unknown as ScheduleInterface[]).find((v) => v.block == a.block && v.type == a.schedule_type).timeStart > 
        //@ts-expect-error
        (schedule as unknown as ScheduleInterface[])?.find((v) => v.block == b.block && v.type == b.schedule_type).timeStart
        ) {return 1}
        //@ts-expect-error
        if ((schedule as unknown as ScheduleInterface[])?.find((v) => v.block == a.block && v.type == a.schedule_type).timeStart < 
        //@ts-expect-error
        (schedule as unknown as ScheduleInterface[])?.find((v) => v.block == b.block && v.type == b.schedule_type).timeStart
        ) {return -1}
        //@ts-expect-error
        if ((schedule as unknown as ScheduleInterface[])?.find((v) => v.block == a.block && v.type == a.schedule_type).timeEnd > 
        //@ts-expect-error
        (schedule as unknown as ScheduleInterface[])?.find((v) => v.block == b.block && v.type == b.schedule_type).timeEnd
        ) {return 1}
        //@ts-expect-error
        if ((schedule as unknown as ScheduleInterface[])?.find((v) => v.block == a.block && v.type == a.schedule_type).timeEnd > 
        //@ts-expect-error
        (schedule as unknown as ScheduleInterface[])?.find((v) => v.block == b.block && v.type == b.schedule_type).timeEnd
        ) {return -1}
        return 0;
    })
}
export function sortClassesByTime2(classes: Database["public"]["Tables"]["classes"]["Row"][],
                                  schedule: ScheduleInterface[]): Database["public"]["Tables"]["classes"]["Row"][] {
    return classes.sort((a, b) => {
        if (!schedule) {return 0}
    
        const aStartTime = (schedule)?.find((v) => v.block == a.block && v.type == a.schedule_type)?.timeStart;
        const bStartTime = (schedule)?.find((v) => v.block == b.block && v.type == b.schedule_type)?.timeStart;
        const aEndTime = (schedule)?.find((v) => v.block == a.block && v.type == a.schedule_type)?.timeEnd;
        const bEndTime = (schedule)?.find((v) => v.block == b.block && v.type == b.schedule_type)?.timeEnd;

        if (aStartTime == null || bStartTime == null) {
            // If either start time is undefined or null, return 0 to indicate that both values are equal
            return 0;
        }
        if (Date.parse(aStartTime) > Date.parse(bStartTime)) {
            return 1;
        }
        if (Date.parse(aStartTime) < Date.parse(bStartTime)) {
            return -1;
        }
        if (aEndTime == null || bEndTime == null) {
            // If either end time is undefined or null, return 0 to indicate that both values are equal
            return 0;
        }
        if (Date.parse(aEndTime) > Date.parse(bEndTime)) {
            return 1;
        }
        if (Date.parse(aEndTime) < Date.parse(bEndTime)) {
            return -1;
        }
        // If none of the conditions are true, return 0 to indicate that both values are equal
        return 0;
    });
}