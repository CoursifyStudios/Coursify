import { ColoredPill } from "@/components/misc/pill";
import { handleStarred } from "@/lib/db/assignments/assignments";
import { Database } from "@/lib/db/database.types";
import { ScheduleInterface, to12hourTime } from "@/lib/db/schedule";
import { CheckIcon } from "@heroicons/react/24/outline";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import Starred from "./starred";
import { useSettings } from "@/lib/stores/settings";

export function AssignmentPreview({
	supabase,
	assignment,
	classes,
	className,
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
	className?: string;
}) {
	const date = assignment.due_date ? new Date(assignment.due_date) : null;
	const [starred, setStarred] = useState(starredAsParam);

	const { data: settings } = useSettings();

	return (
		<div className="relative">
			<Link
				href={"/assignments/" + assignment.id}
				className={`${className} flex  w-full flex-col rounded-xl bg-backdrop-200 p-2.5 `}
			>
				<div className="flex items-end justify-between">
					<div className="ml-8">
						{classes && showClassPill && (
							<Link href={"/classes/" + classes?.id}>
								<ColoredPill color={classes.color} hoverState>
									{classes.name}
								</ColoredPill>
							</Link>
						)}
					</div>
					<div>
						<div tabIndex={-1} className="flex">
							{date ? (
								<>
									<div className="mr-2 font-medium">
										{date.getMonth() + 1}/{date.getDate()}
									</div>
									<ColoredPill color={classes.color}>
										{`${to12hourTime(date, settings.showAMPM)}`}
									</ColoredPill>
								</>
							) : (
								<span className="text-sm italic">No due date</span>
							)}
						</div>
					</div>
				</div>
				<div tabIndex={-1} className="mt-1 flex h-[4.5rem] justify-between">
					<div>
						<p className="line-clamp-3">
							<a className="font-medium">{assignment.name}</a>
							<br />
							<p className="mr-7">{assignment.description}</p>
						</p>
					</div>
				</div>
			</Link>
			<div className="absolute bottom-2 right-2">
				<CheckIcon className="h-6 w-6 shrink-0" />
			</div>
			<div
				className="absolute left-2 top-3 cursor-pointer"
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
