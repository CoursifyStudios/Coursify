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
import ReactDOM from "react-dom";
import { DragZone, DropZone } from "../components/misc/draggableUI";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function Home() {
	const { newTab } = useTabs();
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	//const [dragging, setDragging] = useRef();
	const [classes, setClasses] = useState<AllClassesResponse>();
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState<ScheduleData>();
	// The following three useState things are for the drag and drop UI

	const [upDownUIOrder, setUpDownUIOrder] = useState(false); //This controls what order the UI should be in
	const [showUpDownUIPreviews, setShowUpDownUIPreviews] = useState(false); //This controls wether or not to show previews / indicators of the UI change

	const [leftRightUIOrder, setLeftRightUIOrder] = useState(false);

	const classesUIReference = useRef<HTMLElement>(null); //I hate that these have to exist
	const assignmentsUIReference = useRef<HTMLElement>(null);
	const scheduleUIReference = useRef<HTMLElement>(null);

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
				<div className="flex w-full flex-col lg:flex-row">
					<div
						className={
							leftRightUIOrder ? "flex flex-row-reverse" : "flex flex-row"
						}
					>
						<DropZone
							id="schedule"
							setUIState={setLeftRightUIOrder}
							uIState={leftRightUIOrder}
						>
							<section
								// @upDownUIOrder --> preview has been dropped on field, classes and schedule should change places
								className={
									upDownUIOrder ? "flex flex-col-reverse" : "flex flex-col"
								}
							>
								{/* Classes UI */}
								<DropZone
									id="assignments"
									setPreviewState={setShowUpDownUIPreviews}
									setUIState={setUpDownUIOrder}
									uIState={upDownUIOrder}
								>
									<section className="mb-8" ref={classesUIReference}>
										<div className="mt-8 flex items-end justify-between lg:mt-0">
											<h2 className="title">Classes</h2>
											{loading && <Loading className="ml-8" />}
											<DragZone
												id="classes"
												parent={classesUIReference.current as Element}
												offsetByParentElementWidth={true}
											>
												<div className="-m-2 flex cursor-pointer p-2">
													<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />

													<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
												</div>
											</DragZone>
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
								</DropZone>

								{/* Assignments UI */}
								<DropZone
									id="classes"
									setPreviewState={setShowUpDownUIPreviews}
									setUIState={setUpDownUIOrder}
									uIState={upDownUIOrder}
								>
									<section className="mb-4" ref={assignmentsUIReference}>
										<div className="flex items-end justify-between">
											<h2 className="title">Assignments</h2>
											<DragZone
												id="assignments"
												parent={assignmentsUIReference.current as Element}
												offsetByParentElementWidth={true}
											>
												<div className="-m-2 flex cursor-pointer p-2">
													<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />

													<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
												</div>
											</DragZone>
										</div>
										<div className="mt-4 flex rounded-lg bg-gray-200 px-4 py-2">
											<p>
												ASSIGNEMENT VIEW GOES HERE <br></br>text<br></br>text
												<br></br>IMAGINE THE THING FROM THE FIGMA WAS HEREtext
												<br></br>text<br></br>
											</p>
										</div>
									</section>
								</DropZone>
							</section>
						</DropZone>
						<section className="w-10"></section>
						{/* Schedule UI */}
						<section className="grow" ref={scheduleUIReference}>
							<div className="flex items-end justify-between">
								<h2 className="title mr-2">Daily Schedule</h2>
								<DragZone
									id="schedule"
									parent={scheduleUIReference.current as Element}
									offsetByParentElementWidth={true}
								>
									<div className="-m-2 flex cursor-pointer p-2 ">
										<EllipsisVerticalIcon className="h-6 w-6 translate-x-4 text-gray-600" />

										<EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
									</div>
								</DragZone>
							</div>
							{classes && schedule && (
								<ScheduleComponent classes={classes} schedule={schedule} />
							)}
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
