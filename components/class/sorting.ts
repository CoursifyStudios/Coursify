//import { AllClassesResponse } from "../../lib/db/classes";
//import { ScheduleInterface } from "../../lib/db/schedule";
//import { ArrayElementType } from "../../lib/misc/elementarraytype.types";

//export function sortClasses(
//a: ArrayElementType<AllClassesResponse["data"]>,
//b: ArrayElementType<AllClassesResponse["data"]>,
//schedule: ScheduleInterface[] | undefined,
//scheduleTomorrow: ScheduleInterface[] | undefined
//) {
//return (a.class!.block < b.class!.block) ? 1 : -1
// if (schedule && scheduleTomorrow) {
// 	// Fix the schedule sometimes being undefined and breaking stuff for the first load
// 	schedule ??= [];
// 	const aStartTime = schedule.find(
// 		(v) => v.block == a.class!.block && v.type == a.class!.schedule_type
// 	)?.timeStart;
// 	const aEndTime = schedule.find(
// 		(v) => v.block == a.class!.block && v.type == a.class!.schedule_type
// 	)?.timeEnd;
// 	const bStartTime = schedule.find(
// 		(v) => v.block == b.class!.block && v.type == b.class!.schedule_type
// 	)?.timeStart;
// 	const bEndTime = schedule.find(
// 		(v) => v.block == b.class!.block && v.type == b.class!.schedule_type
// 	)?.timeEnd;
// 	//if both classes are on today's schedule
// 	if (aStartTime && aEndTime && bStartTime && bEndTime) {
// 		if (aStartTime > bStartTime) return 1;
// 		if (aStartTime < bStartTime) return -1;
// 		if (aEndTime > bEndTime) return 1;
// 		if (aEndTime < bEndTime) return -1;
// 		return 0;
// 	}
// 	//if a is on today's schedule, but b is not
// 	if (aStartTime && aEndTime && !bStartTime && !bEndTime) {
// 		return -1; //sort a before b
// 	}
// 	//if b is on today's schedule, but a is not
// 	if (bStartTime && bEndTime && !aStartTime && !aEndTime) {
// 		return 1; //sort b before a
// 	}
// 	//if both a and b are not on today's schedule, define the variables for the next schedule
// 	const aStartTime2 = scheduleTomorrow.find(
// 		(v) => v.block == a.class!.block && v.type == a.class!.schedule_type
// 	)?.timeStart;
// 	const aEndTime2 = scheduleTomorrow.find(
// 		(v) => v.block == a.class!.block && v.type == a.class!.schedule_type
// 	)?.timeEnd;
// 	const bStartTime2 = scheduleTomorrow.find(
// 		(v) => v.block == b.class!.block && v.type == b.class!.schedule_type
// 	)?.timeStart;
// 	const bEndTime2 = scheduleTomorrow.find(
// 		(v) => v.block == b.class!.block && v.type == b.class!.schedule_type
// 	)?.timeEnd;
// 	//if they all exist
// 	if (aStartTime2 && aEndTime2 && bStartTime2 && bEndTime2) {
// 		if (aStartTime2 > bStartTime2) return 1;
// 		if (aStartTime2 < bStartTime2) return -1;
// 		if (aEndTime2 > bEndTime2) return 1;
// 		if (aEndTime2 < bEndTime2) return -1;
// 		return 0;
// 	}
// }
// return 0;
//}
