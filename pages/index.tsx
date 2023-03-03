import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Database } from "../lib/db/database.types";
import { getAllClasses, AllClassesResponse } from "../lib/db/classes";
import { Class, LoadingClass, sortClasses } from "../components/complete/class";
import Loading from "../components/misc/loading";
import {
	getSchedule,
	ScheduleData,
	ScheduleInterface,
} from "../lib/db/schedule";
import ScheduleComponent, {
} from "../components/complete/schedule";

export default function Home() {
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [classes, setClasses] = useState<AllClassesResponse>();
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState<ScheduleData>();

	useEffect(() => {
		//testdateto set a seperate date in development
		const testDate: Date = new Date("2022-11-23");
		(async () => {
			if (user) {
				const classes = await getAllClasses(supabaseClient);
				setClasses(classes);
				setLoading(false);
				sessionStorage.setItem("classes", JSON.stringify(classes));

				//can I piggy-back off of this as well (for now at least?)
				const scheduleClasses = await getSchedule(
					supabaseClient,
					new Date("2022-11-20") //This is set to use this date as it is the only one with a proper, filled in schedule. After dev, we can remove the arguments and just use new Date()
				);
				setSchedule(scheduleClasses);
			}
		})();

		if (user && sessionStorage.getItem("classes")) {
			setClasses(JSON.parse(sessionStorage.getItem("classes") as string));
		}
		// Only run query once user is logged in.
		//if (user) loadData()
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
								{classes && classes.data
									? classes.data
                                    //@ts-ignore
											.sort((a, b) =>
												sortClasses(
													a,
													b,
													schedule?.data
														?.schedule_items as unknown as ScheduleInterface[]
												)
											)
											.map((v, i) => (
												<Class
													class={{ data: v }}
                                                    showLoading={loading}
													key={i}
													className="!w-full xl:!w-[18.5rem]"
													isLink={true}
													time={
														(schedule?.data?.schedule_items as unknown as ScheduleInterface[])?.find((s) => s.specialEvent == undefined && v.block == s.block && v.schedule_type == s.type)
													}
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
							<h2 className="title mr-2">Daily Schedule</h2>
							{classes && schedule ? (
								<ScheduleComponent classes={classes} schedule={schedule} />
							) : (
								// loading component 
                                //why is this so massive lukas jeez
								<div className="mt-6 flex h-36 animate-pulse flex-col justify-between rounded-xl bg-gray-200 p-4">
									<div className="flex justify-between">
										<div className="h-5 w-36 animate-pulse rounded bg-gray-300"></div>
										<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
									</div>
									<div className="flex justify-between">
										<div className="h-5 w-32 animate-pulse rounded bg-gray-300"></div>
										<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
									</div>
									<div className="flex justify-between">
										<div className="h-5 w-36 animate-pulse rounded bg-gray-300"></div>
										<div className="h-5 w-20 animate-pulse rounded bg-gray-300"></div>
									</div>
								</div>
							)}
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
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
