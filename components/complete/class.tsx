import { AllClassesResponse, IndividialClass } from "../../lib/db/classes";
import Image from "next/image";
import { ColoredPill } from "../misc/pill";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";
import { ScheduleInterface, to12hourTime } from "../../lib/db/schedule";
import { NextPage } from "next";
import { NonNullableArray } from "../../lib/misc/misc.types";

export const Class: NextPage<{
	classData:
		| IndividialClass["data"]
		| NonNullableArray<AllClassesResponse["data"]>;
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
								//color="gray"
								className="-mb-0.5 -mt-1 !bg-neutral-500/20 text-xs !text-gray-300 backdrop-blur-xl"
							>
								Rm. {classData.room}
							</ColoredPill>
						)}
						<div className="flex items-center">
							{/* <CircleCounter small amount={50} max={100} /> */}
							<h2
								className={`text-xl text-${classData.color}-300 ml-2 rounded-lg bg-neutral-500/20 px-2 font-bold opacity-75 backdrop-blur-xl`}
							>
								{classData.block}
							</h2>
						</div>
					</div>
				</div>
				<div className="flex flex-grow flex-col  p-4 ">
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
					<div className="mt-2 flex flex-wrap items-center">
						{"users_classes" in classData &&
							"users" in classData &&
							(Array.isArray(classData.users_classes!) ? (
								classData.users_classes!.filter((userData) => userData.teacher)
									.length > 0 ? (
									classData
										.users_classes!.filter((userData) => userData.teacher)
										.map((userData, i) => {
											const user = !Array.isArray(classData.users!)
												? classData.users!
												: classData.users!.find(
														(user) => user.id == userData.user_id
												  );
											if (!user)
												return (
													<p className="text-sm italic text-gray-700">
														No teacher
													</p>
												);

											return (
												<>
													<Link
														href={`/profile/${user.id}`}
														className=" flex flex-col items-center"
													>
														<div className="peer flex items-center rounded-full px-1 py-0.5 hover:bg-gray-300">
															<img
																src={user.avatar_url}
																alt="Profile picture"
																referrerPolicy="no-referrer"
																className=" mr-1 rounded-full shadow shadow-black/25 "
																height={20}
																width={20}
															/>
															<div className="font-semibold">
																{user.full_name}
															</div>
														</div>
														{/* <div className="hidden peer-hover:block absolute mt-6 rounded-xl bg-gray-200/50 backdrop-blur-xl p-4 z-10 shadow-lg">
														test didn't appear over elements idk why
													</div> */}
													</Link>
													<p className="mr-2 -ml-0.5 [&:last-child]:hidden">
														,
													</p>
												</>
											);
										})
								) : (
									<p className="text-sm italic text-gray-700">No teacher</p>
								)
							) : Array.isArray(classData.users) ? (
								<p>An unknown error occured</p>
							) : classData.users_classes?.teacher ? (
								<p>{classData.users?.full_name}</p>
							) : (
								<p className="text-sm italic text-gray-700">No teacher</p>
							))}
						{/* <p>{classData.id}</p> */}
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
	schedule: ScheduleInterface[] | undefined,
	scheduleTomorrow: ScheduleInterface[] | undefined
) {
	if (schedule && scheduleTomorrow) {
		const aStartTime = schedule.find(
			(v) => v.block == a.block && v.type == a.schedule_type
		)?.timeStart;
		const aEndTime = schedule.find(
			(v) => v.block == a.block && v.type == a.schedule_type
		)?.timeEnd;
		const bStartTime = schedule.find(
			(v) => v.block == b.block && v.type == b.schedule_type
		)?.timeStart;
		const bEndTime = schedule.find(
			(v) => v.block == b.block && v.type == b.schedule_type
		)?.timeEnd;
		//if both classes are on today's schedule
		if (aStartTime && aEndTime && bStartTime && bEndTime) {
			if (aStartTime > bStartTime) return 1;
			if (aStartTime < bStartTime) return -1;
			if (aEndTime > bEndTime) return 1;
			if (aEndTime < bEndTime) return -1;
			return 0;
		}
		//if a is on today's schedule, but b is not
		if (aStartTime && aEndTime && !bStartTime && !bEndTime) {
			return -1; //sort a before b
		}
		//if b is on today's schedule, but a is not
		if (bStartTime && bEndTime && !aStartTime && !aEndTime) {
			return 1; //sort b before a
		}
		//if both a and b are not on today's schedule, define the variables for the next schedule
		const aStartTime2 = scheduleTomorrow.find(
			(v) => v.block == a.block && v.type == a.schedule_type
		)?.timeStart;
		const aEndTime2 = scheduleTomorrow.find(
			(v) => v.block == a.block && v.type == a.schedule_type
		)?.timeEnd;
		const bStartTime2 = scheduleTomorrow.find(
			(v) => v.block == b.block && v.type == b.schedule_type
		)?.timeStart;
		const bEndTime2 = scheduleTomorrow.find(
			(v) => v.block == b.block && v.type == b.schedule_type
		)?.timeEnd;
		//if they all exist
		if (aStartTime2 && aEndTime2 && bStartTime2 && bEndTime2) {
			if (aStartTime2 > bStartTime2) return 1;
			if (aStartTime2 < bStartTime2) return -1;
			if (aEndTime2 > bEndTime2) return 1;
			if (aEndTime2 < bEndTime2) return -1;
			return 0;
		}
	}
	return 0;
}

export type ArrayElementType<T> = T extends (infer U)[]
	? U
	: T extends readonly (infer U)[]
	? U
	: never;
