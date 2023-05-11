import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Database } from "../lib/db/database.types";
import {
	getAllClasses,
	AllClassesResponse,
	isTeacher,
} from "../lib/db/classes";
import Loading from "../components/misc/loading";
import { getSchedulesForXDays, ScheduleInterface } from "../lib/db/schedule";
import ScheduleComponent from "../components/complete/schedule";
import { AssignmentPreview } from "../components/complete/assignments/assignments";
import Link from "next/link";
import { useSettings } from "../lib/stores/settings";
import { sortClasses } from "../components/class/sorting";
import { Class } from "../components/class";
import {
	LoadingStudentClass,
	LoadingTeacherClass,
} from "../components/class/loading";

export default function Home() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [classes, setClasses] = useState<AllClassesResponse>();
	const [loading, setLoading] = useState(true);
	const [schedules, setSchedules] = useState<ScheduleInterface[][]>([]);
	const { data: settings } = useSettings();

	//because Lukas left this a mess, until i get around to fixing it
	const dateToday = new Date();
	let dateTomorrow = new Date();
	dateTomorrow.setDate(dateToday.getDate() + 1);
	let dayAfter = new Date();
	dayAfter.setDate(dateToday.getDate() + 2);

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
			parsedSchedules.forEach((parsedSchedule, index) => {
				/**
				 * this sees if the schedule matches the current day. Theoreticlly, if you close
				 * your computer that night and open it up the next day, it *should* have the updated schedule
				 * on it. This is very much a qol edge case thing, but I wanted to add functionality that would make sure it
				 * displayed the correct day as I've missed class due to an error like this in g calender (or it could've
				 * been the fact that I looked at it as I was getting off a plane at 3am, but y'know)
				 *      ...sounds like a skill issue -Bill
				 */
				//PLEASE NOTE I MAY HAVE RUINED THAT FEATURE THAT LUKAS MENTIONED ABOVE
				//PLEASE DIRECT ANY AND ALL COMPLAINTS TO @Seagullz#0212 ON DISCORD
				//IF THIS IS ACTUALLY A PROBLEM LET ME KNOW -BILL
				let temp = schedules;
				temp[index] = parsedSchedule.schedule;
				setSchedules(temp);
			});
		}
	}, []);

	useEffect(() => {
		(async () => {
			if (user) {
				const [classes, scheduleDB] = await Promise.all([
					getAllClasses(supabaseClient),
					// read comment in above useEffect as to why I'm fetching 3 dates -Lukas
					// I'm going to fetch like 5 because weekends or some excuse - Bill
					getSchedulesForXDays(supabaseClient, new Date(), 5),
				]);

				setClasses(classes);
				const fullSchedule: { date: Date; schedule: ScheduleInterface[] }[] =
					[];

				if (scheduleDB.data) {
					scheduleDB.data?.forEach((scheduleDay) => {
						if (
							!Array.isArray(scheduleDay.schedule_templates) &&
							scheduleDay.schedule_templates!.schedule_items
						) {
							fullSchedule.push({
								date: new Date(scheduleDay.date),
								schedule: scheduleDay.schedule_templates
									?.schedule_items as unknown as ScheduleInterface[],
							});
						} else if (
							!scheduleDay.schedule_templates &&
							scheduleDay.schedule_items
						) {
							fullSchedule.push({
								date: new Date(scheduleDay.date),
								schedule:
									scheduleDay.schedule_items as unknown as ScheduleInterface[],
							});
						}
					});
				}

				setLoading(false);
				const tempFullSchedule = fullSchedule.map(({ schedule }) => schedule);
				setSchedules(tempFullSchedule);
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
			<div className="container mx-auto mb-10 flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words px-4 sm:mt-10 md:px-8 xl:px-0">
				<div className="flex w-full flex-col">
					<div className="flex flex-col sm:flex-col-reverse lg:flex-row  ">
						{/* Classes UI */}
						<section id="Classes" className="mb-12">
							<div className="flex items-end md:mt-8 lg:mt-0">
								<h2 className="title">Classes</h2>
							</div>
							<div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 ">
								{classes && classes.data && schedules
									? classes.data
											.slice(0, classes.data.length)
											.sort((a, b) =>
												sortClasses(a, b, schedules[0], schedules[1])
											)
											.map((classData) => (
												<Class
													classData={classData}
													showTimeLoading={loading}
													settings={settings}
													teacher={isTeacher(classData, user.id)}
													key={classData.id}
													className="h-full !w-full xl:!w-[18.5rem]"
													isLink={true}
													time={schedules[0]?.find(
														(s) =>
															s.specialEvent == undefined &&
															classData.block == s.block &&
															classData.schedule_type == s.type
													)}
												/>
											))
									: [...Array(6)].map((_, i) => (
											<LoadingStudentClass
												key={i}
												className="!w-full xl:!w-[18.5rem]"
											/>
									  ))}
							</div>
						</section>
						{/* Schedule UI */}
						<section
							id="Schedule"
							className="flex grow flex-col md:flex-row lg:ml-10 lg:flex-col"
						>
							<div className="w-full md:mr-4 lg:mr-0">
								<h2 className="title mr-2">
									{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
										dateToday
									)}
								</h2>

								<ScheduleComponent classes={classes} schedule={schedules[0]} />
							</div>
							<div className="w-full md:ml-4 lg:ml-0">
								<h2 className="title mr-2">
									{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
										dateTomorrow
									)}
								</h2>
								<ScheduleComponent classes={classes} schedule={schedules[1]} />
							</div>
						</section>
					</div>
					<div className="flex flex-col xl:flex-row ">
						{/* Assignments UI */}
						<section id="Assignments">
							<h2 className="title mb-4">Assignments</h2>
							<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:w-[58.5rem] ">
								{classes &&
									classes.data &&
									classes.data
										.slice(0, classes.data.length)
										.sort((a, b) =>
											sortClasses(a, b, schedules[0], schedules[1])
										)
										.filter(
											(element) =>
												!(
													Array.isArray(element.assignments) &&
													element.assignments.length == 0
												)
										)
										//temporary measure
										.slice(0, 3)
										.map((aClass) => (
											<div key={aClass.id}>
												<div>
													<Link href={"/classes/" + aClass.id}>
														<h2 className="mb-2 text-xl font-semibold">
															{aClass.name}
														</h2>
													</Link>
													<div className="mb-5 flex-col space-y-4 first-letter:space-y-4">
														{Array.isArray(aClass.assignments) &&
															schedules &&
															aClass.assignments.map((assignment) => (
																<div
																	key={assignment.id}
																	className={
																		"brightness-hover rounded-lg bg-backdrop-200 p-2"
																	}
																>
																	<AssignmentPreview
																		supabase={supabaseClient}
																		assignment={
																			Array.isArray(assignment)
																				? assignment[0]
																				: assignment
																		}
																		userId={user.id}
																		starredAsParam={
																			assignment.starred
																				? Array.isArray(assignment.starred)
																					? assignment.starred.length > 0
																					: !!assignment.starred
																				: false
																		}
																		showClassPill={false}
																		schedule={schedules[0]!}
																		scheduleT={schedules[1]!}
																		classes={aClass}
																	/>
																</div>
															))}
													</div>
												</div>
											</div>
										))}
							</div>
						</section>
						<section className=" grow xl:ml-10" id="Starred">
							<h2 className="title mb-4 mr-2">Starred</h2>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
								{classes &&
									classes.data &&
									classes.data.map(
										(aClass) =>
											Array.isArray(aClass.assignments) &&
											schedules &&
											aClass.assignments.map(
												(assignment) =>
													(assignment.starred
														? Array.isArray(assignment.starred)
															? assignment.starred.length > 0
															: !!assignment.starred
														: false) && (
														<div
															key={assignment.id}
															className={" rounded-lg bg-backdrop-200 p-2"}
														>
															<AssignmentPreview
																supabase={supabaseClient}
																assignment={
																	Array.isArray(assignment)
																		? assignment[0]
																		: assignment
																}
																userId={user.id}
																starredAsParam={
																	assignment.starred
																		? Array.isArray(assignment.starred)
																			? assignment.starred.length > 0
																			: !!assignment.starred
																		: false
																}
																showClassPill={true}
																schedule={schedules[0]!}
																scheduleT={schedules[1]!}
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
