import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Database } from "../lib/db/database.types";
import { getAllClasses, AllClassesResponse } from "../lib/db/classes";
import { Class, LoadingClass, sortClasses } from "../components/complete/class";
import Loading from "../components/misc/loading";
import {
	dayPlus,
	getSchedule,
	ScheduleData,
	ScheduleInterface,
} from "../lib/db/schedule";
import ScheduleComponent from "../components/complete/schedule";
import { AssignmentPreview } from "../components/complete/assignments";

export default function Home() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [classes, setClasses] = useState<AllClassesResponse>();
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState<ScheduleInterface[]>();
	const [tomorrowSchedule, setTomorrowSchedule] =
		useState<ScheduleInterface[]>();

	useEffect(() => {
		const [classes, schedule] = [
			sessionStorage.getItem("classes"),
			sessionStorage.getItem("schedule"),
		];
		if (classes) {
			setClasses(JSON.parse(classes));
		}
		if (schedule) {
			const parsedSchedules: { date: string; schedule: ScheduleInterface[] }[] =
				JSON.parse(schedule);
			const today = new Date("2023-03-03");
			parsedSchedules.forEach((parsedSchedule) => {
				/**
				 * this sees if the schedule matches the current day. Theoreticlly, if you close
				 * your computer that night and open it up the next day, it *should* have the updated schedule
				 * on it. This is very much a qol edge case thing, but I wanted to add functionality that would make sure it
				 * displayed the correct day as I've missed class due to an error like this in g calender (or it could've
				 * been the fact that I looked at it as I was getting off a plane at 3am, but y'know)
				 *      ...sounds like a skill issue -Bill
				 */
				if (parsedSchedule.date === today.toISOString()) {
					setSchedule(parsedSchedule.schedule);
				} else if (parsedSchedule.date === dayPlus(today, 1).toISOString()) {
					setTomorrowSchedule(parsedSchedule.schedule);
				}
			});
		}
	}, []);

	useEffect(() => {
		(async () => {
			if (user) {
				const [
					classes,
					//assignments,
					scheduleClasses,
					secondDaySchedule,
					thirdDaySchedule,
				] = await Promise.all([
					getAllClasses(supabaseClient),
					//getAllAssignments(supabaseClient),
					// read comment in above useEffect as to why I'm fetching 3 dates
					getSchedule(supabaseClient, new Date("2023-03-03")),
					getSchedule(supabaseClient, new Date("2023-03-04")),
					getSchedule(supabaseClient, new Date("2023-03-05")),
				]);

				setClasses(classes);
				const fullSchedule: { date: Date; schedule: ScheduleInterface[] }[] =
					[];

				const addScheduleData = (
					scheduleData: ScheduleData,
					date: Date,
					setter?: Dispatch<SetStateAction<ScheduleInterface[] | undefined>>
				) => {
					if (
						!scheduleData.data?.template &&
						scheduleData?.data?.schedule_items
					) {
						const data = scheduleData.data
							?.schedule_items as unknown as ScheduleInterface[];
						if (setter) setter(data);
						fullSchedule.push({ date: date, schedule: data });
					} else if (
						!Array.isArray(scheduleData.data?.schedule_templates) &&
						scheduleData.data?.schedule_templates?.schedule_items
					) {
						const data = scheduleData.data.schedule_templates
							.schedule_items as unknown as ScheduleInterface[];
						if (setter) setter(data);
						fullSchedule.push({ date: date, schedule: data });
					}
				};

				addScheduleData(scheduleClasses, new Date("2023-03-03"), setSchedule);
				addScheduleData(
					secondDaySchedule,
					new Date("2023-03-04"),
					setTomorrowSchedule
				);
				addScheduleData(thirdDaySchedule, new Date("2023-03-05"));

				setLoading(false);
				sessionStorage.setItem("classes", JSON.stringify(classes));
				sessionStorage.setItem("schedule", JSON.stringify(fullSchedule));
			}
		})();
	}, [user, supabaseClient]);
	if (!user) {
		return null;
	}

	return (
		<>
			<div className="container my-10 mx-auto flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words px-4 md:px-8 xl:px-0">
				<div className="flex w-full flex-col">
					<div className="flex">
						<section className="mb-12">
							<div className="mt-8 flex items-end lg:mt-0">
								<h2 className="title">Classes</h2>
								{loading && <Loading className="ml-4" />}
							</div>
							<div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 ">
								{classes && classes.data && schedule
									? classes.data
											.slice(0, classes.data.length)
											.sort((a, b) =>
												sortClasses(a, b, schedule, tomorrowSchedule)
											)
											.map((classData) => (
												<Class
													classData={classData}
													showLoading={loading}
													key={classData.id}
													className="!w-full xl:!w-[18.5rem]"
													isLink={true}
													time={schedule?.find(
														(s) =>
															s.specialEvent == undefined &&
															classData.block == s.block &&
															classData.schedule_type == s.type
													)}
												/>
											))
									: [...Array(6)].map((_, i) => (
											<LoadingClass
												key={i}
												className="!w-full xl:!w-[18.5rem]"
											/>
									  ))}
							</div>
						</section>
						{/* Schedule UI */}
						<section className=" grow lg:ml-10">
							<h2 className="title mr-2">
								{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
									new Date("2023-03-03")
								)}
							</h2>
							<ScheduleComponent classes={classes} schedule={schedule} />
							<h2 className="title mr-2">
								{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
									new Date("2023-03-04")
								)}
							</h2>
							<ScheduleComponent
								classes={classes}
								schedule={tomorrowSchedule}
							/>
						</section>
					</div>
					<div className="flex grow">
						{/* Assignments UI */}
						<section className="">
							<h2 className="title">Assignments</h2>
							<div className="rounded-x grid w-full py-2 xl:w-[58.5rem]">
								{classes &&
									classes.data &&
									classes.data
										.slice(0, classes.data.length)
										.sort((a, b) =>
											sortClasses(a, b, schedule, tomorrowSchedule)
										)
										.map(
											(aClass) =>
												!(
													Array.isArray(aClass.assignments) &&
													aClass.assignments.length == 0
												) && (
													<div key={aClass.id}>
														<h2 className="my-4 font-semibold">
															{aClass.name}
														</h2>
														<div className="flex gap-6 md:grid-cols-2 xl:grid-cols-2">
															{Array.isArray(aClass.assignments) &&
																aClass.assignments.map((assignment) => (
																	<div
																		key={assignment.id}
																		className={
																			"flex rounded-lg bg-gray-200 p-2"
																		}
																	>
																		<AssignmentPreview
																			supabase={supabaseClient}
																			assignment={assignment}
																			userId={user.id}
																			// name={assignment.name}
																			// desc={assignment.description}
																			// id={assignment.id}
																			starredAsParam={
																				assignment.starred
																					? Array.isArray(assignment.starred)
																						? assignment.starred.length > 0
																						: !!assignment.starred
																					: false
																			}
																			schedule={schedule!}
																			scheduleT={tomorrowSchedule!}
																			classes={aClass}
																		/>
																	</div>
																))}
														</div>
													</div>
												)
										)}
							</div>
						</section>
						{/* Starred assignments */}
						<section className=" grow lg:ml-10">
							<h2 className="title mr-2 mb-4">Starred</h2>
							<div className="grid gap-4">
								{classes &&
									classes.data &&
									classes.data.map(
										(aClass) =>
											Array.isArray(aClass.assignments) &&
											aClass.assignments.map(
												(assignment) =>
													(assignment.starred
														? Array.isArray(assignment.starred)
															? assignment.starred.length > 0
															: !!assignment.starred
														: false) && (
														<div
															key={assignment.id}
															className={"flex rounded-lg bg-gray-200 p-2"}
														>
															<AssignmentPreview
																supabase={supabaseClient}
																assignment={assignment}
																userId={user.id}
																// name={assignment.name}
																// desc={assignment.description}
																// id={assignment.id}
																starredAsParam={
																	assignment.starred
																		? Array.isArray(assignment.starred)
																			? assignment.starred.length > 0
																			: !!assignment.starred
																		: false
																}
																schedule={schedule!}
																scheduleT={tomorrowSchedule!}
																classes={aClass}
															/>
														</div>
													)
											)
									)}
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
