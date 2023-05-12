import { CheckIcon } from "@heroicons/react/24/outline";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleStarred } from "../../../lib/db/assignments";
import { Database } from "../../../lib/db/database.types";
import { ScheduleInterface, to12hourTime } from "../../../lib/db/schedule";
import { ColoredPill } from "../../misc/pill";
import Starred from "./starred";

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
	assignment: Database["public"]["Tables"]["assignments"]["Row"];
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
	const date = assignment.due_date ? new Date(assignment.due_date) : null;
	const [starred, setStarred] = useState(starredAsParam);

	return (
		<div className="relative flex h-[6.25rem] w-full flex-col ">
			<div
				className="absolute left-0 top-0"
				tabIndex={0}
				onClick={() => {
					setStarred((starred) => {
						handleStarred(supabase, !starred, assignment.id, userId);
						return !starred;
					});
				}}
				onKeyDown={(key) => {
					if (key.key == "Enter" || key.key == " ") {
						setStarred((starred) => {
							handleStarred(supabase, !starred, assignment.id, userId);
							return !starred;
						});
					}
				}}
			>
				<Starred starred={starred} />
			</div>
			<Link href={"/assignments/" + assignment.id}>
				<div className="flex items-end justify-between">
					<div className="flex">
						<div className="ml-8">
							{classes && showClassPill && (
								<Link href={"/classes/" + classes?.id}>
									<ColoredPill color={classes.color} hoverState>
										{classes.name}
									</ColoredPill>
								</Link>
							)}
						</div>
					</div>
					<div>
						<div tabIndex={-1} className="flex">
							{date ? (
								<>
									<div className="mr-2">
										{date.getMonth()}/{date.getDate()}
									</div>
									<ColoredPill color={classes.color}>
										{`${to12hourTime(date)}`}
									</ColoredPill>
								</>
							) : (
								<span className="text-sm italic">No due date</span>
							)}
						</div>
					</div>
				</div>
				<div tabIndex={-1} className="mt-0.5 flex h-[4.5rem] justify-between">
					<div className="">
						<h1 className="font-medium">{assignment.name}</h1>
						<p className="line-clamp-2">{assignment.description}</p>
					</div>
					<div className="flex items-end">
						<CheckIcon className="h-6 w-6 shrink-0" />
					</div>
				</div>
			</Link>
		</div>
	);
}

export enum DueType {
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
