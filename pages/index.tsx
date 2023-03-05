import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Database } from "../lib/db/database.types";
import { getAllClasses, AllClassesResponse } from "../lib/db/classes";
import { Class, LoadingClass, sortClasses } from "../components/complete/class";
import Loading from "../components/misc/loading";
import {
	getSchedule,
	ScheduleInterface,
} from "../lib/db/schedule";
import ScheduleComponent from "../components/complete/schedule";

export default function Home() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [classes, setClasses] = useState<AllClassesResponse>();
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState<ScheduleInterface[]>();
	const [tomorrowSchedule, setTomorrowSchedule] =
		useState<ScheduleInterface[]>();

	useEffect(() => {
		(async () => {
			if (user) {
				const classes = await getAllClasses(supabaseClient);
				setClasses(classes);

				//can I piggy-back off of this as well (for now at least?)
				const scheduleClasses = await getSchedule(
					supabaseClient,
					new Date("2023-03-03") //This is set to use this date as it is the only one with a proper, filled in schedule. After dev, we can remove the arguments and just use new Date()
				);
				if (
					!scheduleClasses.data?.template &&
					scheduleClasses?.data?.schedule_items
				) {
					setSchedule(
						scheduleClasses.data
							?.schedule_items as unknown as ScheduleInterface[]
					);
				} else if (
					!Array.isArray(scheduleClasses.data?.schedule_templates) &&
					scheduleClasses.data?.schedule_templates?.schedule_items
				) {
					setSchedule(
						scheduleClasses.data.schedule_templates
							.schedule_items as unknown as ScheduleInterface[]
					);
				}

				const tomorrowSchedule = await getSchedule(
					supabaseClient,
					new Date("2023-03-04") //This is set to use this date as it is the only one with a proper, filled in schedule. After dev, we can remove the arguments and just use new Date()
				);
				if (
					!tomorrowSchedule.data?.template &&
					tomorrowSchedule?.data?.schedule_items
				) {
					setTomorrowSchedule(
						scheduleClasses.data
							?.schedule_items as unknown as ScheduleInterface[]
					);
				} else if (
					!Array.isArray(tomorrowSchedule.data?.schedule_templates) &&
					tomorrowSchedule.data?.schedule_templates?.schedule_items
				) {
					setTomorrowSchedule(
						tomorrowSchedule.data.schedule_templates
							.schedule_items as unknown as ScheduleInterface[]
					);
				}
				setLoading(false);
				sessionStorage.setItem("classes", JSON.stringify(classes));
			}
		})();

		if (user && sessionStorage.getItem("classes")) {
			setClasses(JSON.parse(sessionStorage.getItem("classes") as string));
		}
		// Only run query once user is logged in.
		//if (user) loadData()
	}, [user, supabaseClient, schedule]);
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
									? classes.data.slice(0,classes.data.length)
                                        .sort((a, b) => sortClasses(a, b, schedule))
											.map((v, i) => (
												<Class
													class={{ data: v }}
													showLoading={loading}
													key={i}
													className="!w-full xl:!w-[18.5rem]"
													isLink={true}
													time={schedule?.find(
														(s) =>
															s.specialEvent == undefined &&
															v.block == s.block &&
															v.schedule_type == s.type
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
							<div className="mt-6 flex w-full rounded-xl bg-gray-200 px-4 py-2 xl:w-[58.5rem]">
								<p>
									ASSIGNEMENT VIEW GOES HERE <br></br>text<br></br>text
									<br></br>IMAGINE THE THING FROM THE FIGMA WAS HEREtext
									<br></br>text<br></br>
								</p>
							</div>
						</section>
						{/* Starred assignments */}
						<section className=" grow lg:ml-10">
							<h2 className="title mr-2">Starred</h2>
							<p>
								STARRED GOES HERE <br></br>text<br></br>text
								<br></br>IMAGINE THE THING FROM THE FIGMA WAS HEREtext
								<br></br>text<br></br>
							</p>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
