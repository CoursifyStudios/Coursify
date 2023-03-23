import { CheckIcon } from "@heroicons/react/24/outline";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import { handleStarred } from "../../lib/db/assignments";
import { Database } from "../../lib/db/database.types";
import { ScheduleInterface, to12hourTime } from "../../lib/db/schedule";
import { ColoredPill } from "../misc/pill";
import Starred from "../misc/starred";

export function AssignmentPreview({
	supabase,
	assignment,
	classes,
	starredAsParam,
	schedule,
	scheduleT,
	userId,
	showClassPill,
}: {
	supabase: SupabaseClient<Database>;
	assignment: {
		id: string;
		name: string;
		description: string;
		due_type: number;
		due_date: string;
	};
	starredAsParam: boolean;
	schedule: ScheduleInterface[];
	scheduleT: ScheduleInterface[];
	userId: string;
	classes: {
		id: string;
		name: string;
		color: string;
		block: number;
		schedule_type: number;
	};
	showClassPill: boolean;
}) {
	const date = new Date(assignment.due_date!);
	const [starred, setStarred] = useState(starredAsParam);
	const [dbStarred, setDbStarred] = useState(starredAsParam);

	const dealWithStarred = async () => {
		const newStarred = await handleStarred(
			supabase,
			starred,
			dbStarred,
			assignment.id,
			userId
		);
		setDbStarred(newStarred);
	};
	return (
		<div className="">
			<div className="mb-1 flex justify-between">
				<div className="flex">
					<div className="h-full" onMouseLeave={() => dealWithStarred()}>
						<span onClick={() => setStarred((starred) => !starred)}>
							<Starred starred={starred} />
						</span>
					</div>
					<div className="ml-2">
						{classes && showClassPill && (
							<Link href={"/classes/" + classes?.id}>
								<ColoredPill color={classes.color} hoverState>
									{classes.name}
								</ColoredPill>
							</Link>
						)}
					</div>
				</div>
				<div className="flex items-center">
					<div className="mr-2 text-sm font-medium text-gray-700">
						{date.getMonth()}/{date.getDate()}
					</div>
					<ColoredPill color={classes.color}>
						{timeOfAssignment(
							classes,
							schedule,
							scheduleT,
							assignment.due_type!
						)
							? timeOfAssignment(
									classes,
									schedule,
									scheduleT,
									assignment.due_type!
							  )
							: to12hourTime(date.getHours() + ":" + date.getMinutes())}
					</ColoredPill>
				</div>
			</div>
			<div>
				<h1 className="text font-medium">{assignment.name}</h1>
				<div className="flex items-end justify-between">
					<p className="w-[12rem] break-words line-clamp-3  ">
						{assignment.description}
					</p>
					<CheckIcon className="h-6 w-6" />
				</div>
			</div>
		</div>
	);
}

enum DueType {
	DATE = 0,
	START_OF_CLASS = 1,
	END_OF_CLASS = 2,
}

export function timeOfAssignment(
	classParam: {
		id: string;
		name: string;
		color: string;
		block: number;
		schedule_type: number;
	},
	schedule: ScheduleInterface[],
	scheduleT: ScheduleInterface[],
	dueType: DueType
) {
	// Checks if the class is today
	if (
		schedule.find(
			(s) =>
				s.specialEvent == undefined &&
				classParam.block == s.block &&
				classParam.schedule_type == s.type
		)
	) {
		// If the assignment is due at the start of the class
		if (dueType == DueType.START_OF_CLASS) {
			return schedule.find(
				(s) =>
					s.specialEvent == undefined &&
					classParam.block == s.block &&
					classParam.schedule_type == s.type
			)?.timeStart;
			// If the assignment is due at the end of the class
		} else if (dueType == DueType.END_OF_CLASS) {
			return schedule.find(
				(s) =>
					s.specialEvent == undefined &&
					classParam.block == s.block &&
					classParam.schedule_type == s.type
			)?.timeStart;
		}
		// If the class is not today, but it is tomorrow
	} else if (
		scheduleT.find(
			(s) =>
				s.specialEvent == undefined &&
				classParam.block == s.block &&
				classParam.schedule_type == s.type
		)
	) {
		// If the assignment is due at the start of the class
	}
	if (dueType == DueType.START_OF_CLASS) {
		return scheduleT.find(
			(s) =>
				s.specialEvent == undefined &&
				classParam.block == s.block &&
				classParam.schedule_type == s.type
		)?.timeStart;
		// If the assignment is due at the end of the class
	} else if (dueType == DueType.END_OF_CLASS) {
		return scheduleT.find(
			(s) =>
				s.specialEvent == undefined &&
				classParam.block == s.block &&
				classParam.schedule_type == s.type
		)?.timeStart;
	}
	return null;
}
