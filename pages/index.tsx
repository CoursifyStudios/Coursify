import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import HomepageClassesUI from "../components/class/homepage";
//import { sortClasses } from "../components/class/sorting";
import { AssignmentPreview } from "../components/assignments/assignments";
import ScheduleComponent from "../components/complete/schedule";
import {
	AllClasses,
	AllClassesResponse,
	getAllClasses,
} from "../lib/db/classes";
import { Database } from "../lib/db/database.types";
import { ScheduleInterface, getSchedulesForXDays } from "../lib/db/schedule";
import { useSettings } from "../lib/stores/settings";
import blankCanvas from "@/public/svgs/blank-canvas.svg";
import Layout from "@/components/layout/layout";
import Image from "next/image";

const Home = () => {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [classes, setClasses] = useState<AllClasses>();
	const [loading, setLoading] = useState(true);
	const [schedules, setSchedules] = useState<
		{ schedule: ScheduleInterface[]; date: Date }[]
	>([]);
	const dateFormat = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		timeZone: "Europe/London",
	});

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
				 * this sees if the schedule matches the current day. Theoretically, if you close
				 * your computer that night and open it up the next day, it *should* have the updated schedule
				 * on it. This is very much a qol edge case thing, but I wanted to add functionality that would make sure it
				 * displayed the correct day as I've missed class due to an error like this in g calender (or it could've
				 * been the fact that I looked at it as I was getting off a plane at 3am, but y'know)
				 *      ...sounds like a skill issue -Bill
				 */
				const temp = schedules;
				temp[index] = {
					schedule: parsedSchedule.schedule,
					date: new Date(parsedSchedule.date),
				};
				setSchedules(temp);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!Array.isArray(classes)) setClasses(undefined);
		(async () => {
			if (user) {
				const [classes, scheduleDB] = await Promise.all([
					getAllClasses(supabaseClient, user.id),
					// read comment in above useEffect as to why I'm fetching 3 dates -Lukas
					// I'm going to fetch like 5 because weekends or some excuse - Bill
					getSchedulesForXDays(supabaseClient, new Date(), 2),
				]);

				if (classes.data && classes.data[0]) {
					const data = classes.data.filter((mappedClass) => mappedClass.class);
					setClasses(data);
				}

				const fullSchedule: { date: Date; schedule: ScheduleInterface[] }[] =
					[];

				if (scheduleDB.data) {
					scheduleDB.data
						?.sort(
							(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
						)
						.forEach((scheduleDay) => {
							if (
								scheduleDay.schedule_templates &&
								!Array.isArray(scheduleDay.schedule_templates) &&
								scheduleDay.schedule_templates.schedule_items
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
				setSchedules(fullSchedule);
				setLoading(false);
				sessionStorage.setItem("classes", JSON.stringify(classes));
				sessionStorage.setItem("schedule", JSON.stringify(fullSchedule));
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, supabaseClient]);
	if (!user) {
		return null;
	}

	return (
		<>
			<div className="container mx-auto mb-10 flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words px-4 sm:mt-10 md:px-8 xl:px-0">
				<div className="flex w-full flex-col">
					<div className="mb-12 flex flex-col sm:flex-col-reverse lg:flex-row ">
						{/* Classes UI */}
						<section id="Classes" className="">
							<HomepageClassesUI
								classes={classes}
								loading={loading}
								schedules={schedules.map((schedule) => schedule.schedule)}
								userID={user.id}
							/>
						</section>
						{/* Schedule UI */}
						<section
							id="Schedule"
							className="flex grow flex-col md:flex-row lg:ml-10 lg:flex-col"
						>
							{schedules.map((schedule, index) => (
								<div key={index} className="w-full md:mr-4 lg:mr-0">
									<h2 className="title mr-2">
										{dateFormat.format(schedule.date)}
									</h2>

									<ScheduleComponent
										classes={classes}
										schedule={schedule.schedule}
										loading={loading}
									/>
								</div>
							))}
						</section>
					</div>
					{Array.isArray(classes) &&
						!(
							classes?.filter(
								(mappedClass) =>
									!mappedClass.class?.class_users.some(
										(cu) => cu.user_id == user.id && cu.teacher
									)
							).length == 0
						) && (
							<div className="flex flex-col xl:flex-row ">
								{/* Assignments UI */}
								<section id="Assignments">
									<h2 className="title mb-4">Assignments</h2>
									<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:w-[58.5rem] ">
										{classes &&
											Array.isArray(classes) &&
											classes

												.sort(
													(a, b) =>
														//sortClasses(a, b, schedules[0], schedules[1])
														a.class!.block - b.class!.block
												)

												.map((mappedClass) => {
													const aClass = mappedClass.class;

													if (
														aClass == null ||
														aClass.class_users.some(
															(cu) => cu.user_id == user.id && cu.teacher
														)
													)
														return null;

													return (
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
																		aClass.assignments
																			.slice(0, 3)
																			.map((assignment) => (
																				<AssignmentPreview
																					className="brightness-hover"
																					key={assignment.id}
																					supabase={supabaseClient}
																					assignment={
																						Array.isArray(assignment)
																							? assignment[0]
																							: assignment
																					}
																					userId={user.id}
																					starredAsParam={
																						assignment.starred
																							? Array.isArray(
																									assignment.starred
																							  )
																								? assignment.starred.length > 0
																								: !!assignment.starred
																							: false
																					}
																					showClassPill={false}
																					classes={aClass}
																				/>
																			))}
																</div>
															</div>
														</div>
													);
												})}
									</div>
								</section>
								<section className=" grow xl:ml-10" id="Starred">
									<h2 className="title mb-4 mr-2">Starred</h2>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
										{classes &&
											Array.isArray(classes) &&
											classes.map((mappedClass) => {
												const aClass = mappedClass.class;
												if (aClass == null) return null;

												const assignments: ReactNode[] = [];

												Array.isArray(aClass.assignments) &&
													schedules &&
													aClass.assignments.map(
														(assignment) =>
															(assignment.starred
																? Array.isArray(assignment.starred)
																	? assignment.starred.length > 0
																	: !!assignment.starred
																: false) &&
															assignments.push(
																<AssignmentPreview
																	key={assignment.id}
																	className="brightness-hover"
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
																	classes={aClass}
																/>
															)
													);

												return assignments;
											})}
										{classes &&
											Array.isArray(classes) &&
											classes.every(
												(mappedClass) =>
													!mappedClass.class ||
													!Array.isArray(mappedClass.class.assignments) ||
													mappedClass.class.assignments.every(
														(assignment) =>
															!assignment.starred ||
															(Array.isArray(assignment.starred)
																? assignment.starred.length === 0
																: !assignment.starred)
													)
											) && (
												<div className="w-full m-auto flex flex-col justify-center items-center h-full">
													<Image
														src={blankCanvas}
														draggable={false}
														alt="No starred assignments found"
														className="px-20"
													/>
													<h1 className="mt-6 max-w-xs text-center font-semibold">
														Star an assignment to view it here
													</h1>
												</div>
											)}
									</div>
								</section>
							</div>
						)}
				</div>
			</div>
		</>
	);
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};
