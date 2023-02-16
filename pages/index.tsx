import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTabs } from "../lib/tabs/handleTabs";
import { Database } from "../lib/db/database.types";
import { getAllClasses, AllClassesResponse } from "../lib/db/classes";
import { Class, LoadingClass } from "../components/complete/class";
import Loading from "../components/misc/loading";
import { getSchedule, ScheduleData } from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";
import ScheduleComponent from "../components/complete/schedule";
import { DragZone, DropZone } from "../components/misc/draggableUI";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";

export default function Home() {
	const { newTab } = useTabs();
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
						{/* Classes UI */}

						<section className="mb-12">
							<div className="mt-8 flex items-end lg:mt-0">
								<h2 className="title">Classes</h2>
								{loading && <Loading className="ml-4" />}
								<div className="-m-2 ml-auto flex cursor-pointer  p-2">
									<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />
									<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
								</div>
							</div>
							<div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 ">
								{classes && classes.data
									? classes.data.map((v, i) => (
											<Class
												class={{ data: v }}
												key={i}
												className="!w-full xl:!w-[18.5rem]"
												isLink={true}
											/>
									  ))
									: [...Array(6)].map((_, i) => <LoadingClass key={i} />)}
							</div>
						</section>
						{/* Schedule UI */}
						<section className=" grow lg:ml-10">
							<div className="flex items-end justify-between">
								<h2 className="title mr-2">Daily Schedule</h2>
								<div className="-m-2 flex cursor-pointer p-2 ">
									<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />
									<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
								</div>
							</div>
							{classes && schedule ? (
								<ScheduleComponent classes={classes} schedule={schedule} />
							) : (
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
							<div className="flex items-end justify-between">
								<h2 className="title">Assignments</h2>

								<div className="-m-2 flex cursor-pointer p-2">
									<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />
									<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
								</div>
							</div>
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
							<div className="flex items-end justify-between">
								<h2 className="title mr-2">Starred</h2>
								<div className="-m-2 flex cursor-pointer p-2 ">
									<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />
									<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
