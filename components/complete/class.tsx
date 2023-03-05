import { AllClassesResponse, IndividialClass } from "../../lib/db/classes";
import Image from "next/image";
import { ColoredPill } from "../misc/pill";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";
import { ScheduleInterface, to12hourTime } from "../../lib/db/schedule";
import { NextPage } from "next";

export const Class: NextPage<{
	classData: IndividialClass["data"];
	showLoading?: boolean;
	time?: ScheduleInterface;
	className?: string;
	isLink?: boolean;
}> = ({ classData, showLoading, time, className, isLink }) => {
	const { newTab } = useTabs();

	if (isLink)
		return (
			<Link
				href={isLink && "/classes/" + classData.id}
				onClick={() => newTab("/classes/" + classData.id, classData.name)}
			>
				<Component />
			</Link>
		);

	return <Component />;

	function Component() {
		return (
			<div
				className={
					"brightness-hover group flex w-[19rem] cursor-pointer select-none flex-col rounded-xl bg-gray-200 " +
					className
				}
			>
				<div className="relative h-32 ">
					<Image
						src={exampleImage}
						loading="eager"
						alt="Example Image"
						className="rounded-t-xl object-cover object-center"
						placeholder="blur"
						fill
					/>
					<div className="absolute top-2 right-2 left-2 flex items-center justify-between space-x-2">
						{classData.room && (
							<ColoredPill
								color="gray"
								className="-mb-0.5 -mt-1 !bg-neutral-500/20 text-xs !text-gray-300 backdrop-blur-xl"
							>
								Rm. {classData.room}
							</ColoredPill>
						)}
						<h2
							className={`text-xl text-${classData.color}-300 rounded-lg bg-neutral-500/20 px-2 font-bold opacity-75 backdrop-blur-xl`}
						>
							{classData.block}
						</h2>
					</div>
				</div>
				<div className="flex flex-grow flex-col  p-4">
					<div className="flex items-start justify-between">
						<h3 className="break-words text-xl font-semibold line-clamp-2">
							{classData.name}
						</h3>
						<ColoredPill
							color={time?.timeStart != undefined ? classData.color : "gray"}
							className={
								showLoading
									? "h-5 w-20 animate-pulse"
									: time?.timeStart == undefined
									? "hidden"
									: ""
							}
						>
							{time?.timeStart != undefined && !showLoading
								? to12hourTime(time?.timeStart) +
								  " - " +
								  to12hourTime(time?.timeEnd)
								: ""}
						</ColoredPill>
					</div>
					<div className="flex justify-between">
						<p>Teacher name</p>
					</div>
				</div>
			</div>
		);
	}
};

export const LoadingClass = ({ className }: { className: string }) => {
	return (
		<div
			className={`flex h-48 w-[19rem] animate-pulse rounded-xl bg-gray-200 ${className}`}
		></div>
	);
};

export function sortClasses(
	a: ArrayElementType<AllClassesResponse["data"]>,
	b: ArrayElementType<AllClassesResponse["data"]>,
	schedule: ScheduleInterface[] | undefined
) {
	if (!a || !b) return -1;
	if (schedule) {
		if (
			schedule?.find((v) => v.block == a.block && v.type == a.schedule_type) ==
			undefined
		)
			return 1;
		if (
			schedule?.find((v) => v.block == b.block && v.type == b.schedule_type) ==
			undefined
		)
			return -1;
		if (
			//@ts-ignore
			schedule?.find((v) => v.block == a.block && v.type == a.schedule_type)
				?.timeStart >
			//@ts-ignore
			schedule?.find((v) => v.block == b.block && v.type == b.schedule_type)
				?.timeStart
		)
			return 1;
		if (
			//@ts-ignore
			schedule?.find((v) => v.block == a.block && v.type == a.schedule_type)
				?.timeStart <
			//@ts-ignore
			schedule?.find((v) => v.block == b.block && v.type == b.schedule_type)
				?.timeStart
		)
			return -1;
		if (
			//@ts-ignore
			schedule?.find((v) => v.block == a.block && v.type == a.schedule_type)
				?.timeEnd >
			//@ts-ignore
			schedule?.find((v) => v.block == b.block && v.type == b.schedule_type)
				?.timeEnd
		)
			return 1;
		if (
			//@ts-ignore
			schedule?.find((v) => v.block == a.block && v.type == a.schedule_type)
				?.timeEnd <
			//@ts-ignore
			schedule?.find((v) => v.block == b.block && v.type == b.schedule_type)
				?.timeEnd
		)
			return -1;
	} else return -1;
	return 0;
}

export type ArrayElementType<T> = T extends (infer U)[]
	? U
	: T extends readonly (infer U)[]
	? U
	: never;
