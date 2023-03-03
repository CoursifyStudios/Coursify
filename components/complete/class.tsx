import { AllClassesResponse, IndividialClass } from "../../lib/db/classes";
import Image from "next/image";
import { ColoredPill } from "../misc/pill";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";
import { ScheduleInterface, to12hourTime } from "../../lib/db/schedule";

export function Class(props: {
	class: IndividialClass;
	showLoading: boolean;
	time?: ScheduleInterface;
	className?: string;
	isLink?: boolean;
}) {
	const classData = props.class.data;

	const { newTab } = useTabs();

	if (props.isLink)
		return (
			<Link
				href={props.isLink && "/classes/" + classData.id}
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
					props.className
				}
			>
				<div className="relative h-32 ">
					<Image
						src={exampleImage}
						alt="Example Image"
						className="rounded-t-xl object-cover object-center"
						placeholder="blur"
						fill
					/>
				</div>
				<div className="flex flex-grow flex-col  p-4">
					<div className="flex items-start justify-between">
						<h3 className="break-words text-xl font-semibold line-clamp-2">
							{classData.name}
						</h3>
						<ColoredPill
							color={
								props.time?.timeStart != undefined ? classData.color : "gray"
							}
							className={
								props.showLoading
									? "w-20 animate-pulse"
									: props.time?.timeStart == undefined
									? "px-0 py-0"
									: ""
							}
						>
							{props.time?.timeStart != undefined
								? to12hourTime(props.time?.timeStart) +
								  " - " +
								  to12hourTime(props.time?.timeEnd)
								: ""}
						</ColoredPill>
					</div>
					<p>Teacher name</p>
				</div>
			</div>
		);
	}
}

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
	} else return 1;
	return 0;
}

export type ArrayElementType<T> = T extends (infer U)[]
	? U
	: T extends readonly (infer U)[]
	? U
	: never;
