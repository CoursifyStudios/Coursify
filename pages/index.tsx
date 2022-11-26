import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useBearStore, useTabs } from "../lib/tabs/handleTabs";
import { Database } from "../lib/db/database.types";
import { AllClassData, loadData } from "../lib/db/classes";
import { Class } from "../components/classes/class";
import Loading from "../components/misc/loading";
import {
	getSchedule,
	ScheduleData,
	ScheduleInterface,
	to12hourTime,
} from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";

export default function Home() {
	const { newTab, tabs } = useTabs();
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [classes, setClasses] = useState<AllClassData>();
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState<ScheduleData>();

	useEffect(() => {
		(async () => {
			if (user) {
				const classes = await loadData(supabaseClient);
				setClasses(classes);
				setLoading(false);
				sessionStorage.setItem("classes", JSON.stringify(classes));

				//can I piggy-back off of this as well (for now at least?)
				const scheduleClasses = await getSchedule(
					supabaseClient,
					new Date("2022-11-23")
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
			<div className="mx-auto mt-4 flex">
				<div
					className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 font-medium"
					onClick={() => supabaseClient.auth.signOut()}
				>
					Logout
				</div>
				<Link href="/settings" onClick={() => newTab("/settings")}>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Settings
					</div>
				</Link>
				<Link href="/tabstest" onClick={() => newTab("/tabstest")}>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Testing Tab
					</div>
				</Link>

				<Link href="/scheduleEditor" onClick={() => newTab("/scheduleEditor")}>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Add Schedule item
					</div>
				</Link>

				<Link
					href="/profile/3000746abfff-e526-41d8-8bd0-ed420fe4f244"
					onClick={() =>
						newTab("/profile/3000746abfff-e526-41d8-8bd0-ed420fe4f244")
					}
				>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Profile
					</div>
				</Link>
			</div>

			<div className="my-10 mx-auto flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words">
				<div className="flex w-full">
					<section className="px-5">
						<div className="flex items-center">
							<h2 className="title">Classes</h2>
							{loading && <Loading className="ml-4" />}
						</div>
						<div className="mt-6 grid grid-cols-3 gap-10">
							{classes &&
								classes.data &&
								classes.data.map((v, i) => (
									<Link
										href={"/classes/" + v.id}
										onClick={() => "/classes/" + v.id}
										key={i}
									>
										<Class class={{ data: v }} key={i} />
									</Link>
								))}
						</div>
					</section>
					<section className="flex-1 px-5">
						<h2 className="title">Daily Schedule</h2>
						<div className="mt-6 flex flex-col">
							<div className=" mt-6 grid grid-cols-1 gap-5 rounded-xl bg-gray-200 p-4">
								{schedule &&
									schedule.data &&
									schedule.data.schedule_items &&
									Array.isArray(schedule.data.schedule_items) &&
									(
										schedule.data
											?.schedule_items as unknown as ScheduleInterface[]
									).map(
										(item, index) =>
											(classes?.data?.find(
												(v) =>
													v.block == item.block && v.schedule_type == item.type
											)?.name && (
												<Link
													key={index}
													className="flex items-center justify-between font-semibold"
													href={
														"/classes/" +
														classes?.data?.find(
															(v) =>
																v.block == item.block &&
																v.schedule_type == item.type
														)?.id
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
													<ColoredPill color="blue">
														{to12hourTime(item.timeStart)} -{" "}
														{to12hourTime(item.timeEnd)}
													</ColoredPill>
												</Link>
											)) ||
											(item.specialEvent && (
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
}
