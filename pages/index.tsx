import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTabs } from "../lib/tabs/handleTabs";
import { Database } from "../lib/db/database.types";
import { getAllClasses, AllClassesResponse } from "../lib/db/classes";
import { Class } from "../components/complete/class";
import Loading from "../components/misc/loading";
import {
	getSchedule,
	ScheduleData,
	ScheduleInterface,
	to12hourTime,
} from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";

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
							"Lukas' Profile"
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
							{classes &&
								classes.data &&
								classes.data.map((v, i) => (
									<Link
										href={"/classes/" + v.id}
										onClick={() => "/classes/" + v.id}
										key={i}
									>
										<Class
											class={{ data: v }}
											key={i}
											className="!w-full xl:!w-[18.5rem]"
										/>
									</Link>
								))}
						</div>
					</section>
					<section className=" grow lg:ml-10 ">
						<h2 className="title">Daily Schedule</h2>
						{/* Line below requires flex. flex was removed temporarily by bill because it made the ui look bad */}
						<div className="flex flex-col">
							<div className=" mt-6 grid max-w-md gap-5 rounded-xl bg-gray-200 p-4">
								{schedule &&
									schedule.data &&
									schedule.data.schedule_items &&
									Array.isArray(schedule.data.schedule_items) &&
									(
										schedule.data
											?.schedule_items as unknown as ScheduleInterface[]
									).map(
										(item, index) =>
											(checkClassMatchesSchedule(item)?.name &&
												!item.specialEvent && (
													<Link
														key={index}
														className="flex items-center justify-between font-semibold"
														href={
															"/classes/" + checkClassMatchesSchedule(item)?.id
														}
													>
														{
															classes?.data?.find(
																(v) =>
																	v.block == item.block &&
																	v.schedule_type == item.type
															)?.name
														}
														{/* Class coloring would be implemented on line below. See the special event implementation fo rhwo that should look */}
														<ColoredPill
															color={
																//@ts-ignore WHY THE HELL DOES IT THINK THAT IT CAN JUST DO THAT TO ME
																checkClassMatchesSchedule(item).color
															}
														>
															{to12hourTime(item.timeStart)} -{" "}
															{to12hourTime(item.timeEnd)}
														</ColoredPill>
													</Link>
												)) ||
											(item.specialEvent && checkClassMatchesSchedule(item) && (
												// May want to change this to be a <Link> later on so that you can link to info about special events
												<div className="flex items-center justify-between font-semibold">
													{item.specialEvent}
													<ColoredPill
														color={
															item.customColor ? item.customColor : "green"
														}
													>
														{to12hourTime(item.timeStart)} -{" "}
														{to12hourTime(item.timeEnd)}
													</ColoredPill>
												</div>
											))
									)}
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);

	function checkClassMatchesSchedule(scheduleItem: ScheduleInterface) {
		return classes?.data?.find(
			(v) =>
				v.block == scheduleItem.block && v.schedule_type == scheduleItem.type
		);
	}
}
