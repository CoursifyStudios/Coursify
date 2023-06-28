import Link from "next/link";
import { AllClassesResponse, IndividualClass } from "../../lib/db/classes";
import { ScheduleInterface } from "../../lib/db/schedule";
import { NonNullableArray } from "../../lib/misc/misc.types";
import { useTabs } from "../../lib/tabs/handleTabs";
import StudentClass from "./student";
import TeacherClass from "./teacher";

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
}: TeacherClassType): JSX.Element;

export function Class({
	classData,
	showTimeLoading,
	time,
	className,
	isLink,
	teacher = false,
}: (StudentClassType & { isLink?: boolean }) | TeacherClassType) {
	const { newTab } = useTabs();

	const ClassComponent = () => {
		// @ts-expect-error ts is wierd
		if (teacher && classData.class_users)
			return (
				<TeacherClass
					classData={classData as NonNullableArray<AllClassesResponse["data"]>}
					className={className}
					showTimeLoading={showTimeLoading}
					teacher={teacher}
					time={time}
				/>
			);
		return (
			<StudentClass
				classData={classData}
				className={className}
				showTimeLoading={showTimeLoading}
				time={time}
			/>
		);
	};

	if (isLink && !teacher)
		return (
			<Link
				href={"/classes/" + classData.id}
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
}

export interface TeacherClassType extends StudentClassType {
	teacher: true;
	classData: NonNullableArray<AllClassesResponse["data"]>;
	isLink?: boolean;
}

export type ClassData =
	| IndividualClass["data"]
	| NonNullableArray<AllClassesResponse["data"]>;
