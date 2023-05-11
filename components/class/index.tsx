import Link from "next/link";
import { IndividialClass, AllClassesResponse } from "../../lib/db/classes";
import { ScheduleInterface } from "../../lib/db/schedule";
import { NonNullableArray } from "../../lib/misc/misc.types";
import { Settings, useSettings } from "../../lib/stores/settings";
import { useTabs } from "../../lib/tabs/handleTabs";
import StudentClass from "./student";
import TeacherClass from "./teacher";
import { ReactNode } from "react";

export function Class({
	classData,
	showTimeLoading,
	time,
	className,
	isLink,
	teacher,
}: StudentClassType & { isLink?: boolean }): JSX.Element;

export function Class({
	classData,
	showTimeLoading,
	time,
	className,
	isLink,
	teacher = true,
}: TeacherClassType & { isLink?: boolean }): JSX.Element;

export function Class({
	classData,
	showTimeLoading,
	time,
	className,
	settings,
	isLink,
	teacher = false,
}:
	| (StudentClassType & { isLink?: boolean })
	| (TeacherClassType & { isLink?: boolean })) {
	const { newTab } = useTabs();

	const ClassComponent = () => {
		if (teacher) return <TeacherClass />;
		return (
			<StudentClass
				classData={classData}
				settings={settings}
				className={className}
				showTimeLoading={showTimeLoading}
				time={time}
			/>
		);
	};

	if (isLink)
		return (
			<Link
				href={isLink && "/classes/" + classData.id}
				onClick={() => newTab("/classes/" + classData.id, classData.name)}
			>
				<ClassComponent />
			</Link>
		);

	return <ClassComponent />;
}

export interface StudentClassType {
	showTimeLoading?: boolean;
	time?: ScheduleInterface;
	className?: string;
	teacher?: boolean;
	classData: ClassData;
	settings: Settings;
}

export interface TeacherClassType extends StudentClassType {
	teacher: true;
}

export type ClassData =
	| IndividialClass["data"]
	| NonNullableArray<AllClassesResponse["data"]>;
