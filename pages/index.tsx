import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTabs } from "../lib/tabs/handleTabs";
import { Database } from "../lib/db/database.types";
import { getAllClasses, AllClassesResponse } from "../lib/db/classes";
import { Class, LoadingClass } from "../components/complete/class";
import Loading from "../components/misc/loading";
import {
	getSchedule,
	ScheduleData,
	ScheduleInterface,
	to12hourTime,
} from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";
import ScheduleComponent from "../components/complete/schedule";

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
			<div className="mx-auto mt-4 flex ">
				<div
					className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 font-medium"
					onClick={() => supabaseClient.auth.signOut()}
				>
					Logout
				</div>

				<Link href="/scheduleEditor" onClick={() => newTab("/scheduleEditor")}>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Add Schedule
					</div>
				</Link>

				<Link
					href="/profile/1e5024f5-d493-4e32-9822-87f080ad5516"
					onClick={() =>
						newTab(
							"/profile/1e5024f5-d493-4e32-9822-87f080ad5516",
							"quick007's Profile"
						)
					}
				>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Profile
					</div>
				</Link>
			</div>

			<div className="container my-10 mx-auto flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words  px-4 md:px-8 xl:px-0">
				<div className="flex w-full flex-col-reverse lg:flex-row">
					<section>
						<div className="mt-8 flex items-center lg:mt-0">
							<h2 className="title">Classes</h2>
							{loading && <Loading className="ml-4" />}
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
					<section className=" grow lg:ml-10 ">
						<h2 className="title">Daily Schedule</h2>
						{/* Line below requires flex. flex was removed temporarily by bill because it made the ui look bad */}
                        {classes && schedule &&
                        <ScheduleComponent classes={classes} schedule={schedule} />
}
					</section>
				</div>
			</div>
		</>
	);
}
