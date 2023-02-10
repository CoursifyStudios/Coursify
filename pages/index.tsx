import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect, useRef, ReactInstance } from "react";
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
import ReactDOM from "react-dom";

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
			<div className="container my-10 mx-auto flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words px-4 md:px-8 xl:px-0">
				<div className="flex w-full flex-col lg:flex-row">
                    
                    <div className="flex flex-row">
                        <section 
                        // @upDownUIOrder --> preview has been dropped on field, classes and schedule should change places
                        // @draggingMode --> which elements on the page are changing places
                        className={upDownUIOrder? "flex flex-col-reverse": "flex flex-col"}>
                            {/* marker that you are over the drop area */}
                            <div className={showUpDownUIPreviews? "flex w-full bg-gray-100 rounded-md px-2 my-4": "hidden"}>
                            <br></br>
                            </div>
                            {/* Classes UI */}
                            <section className="mb-8"
                            //event handlers for Classes drop area (where assignments would land)
                            onDragOver={(e) => { if (e.dataTransfer.types.includes("assignments")) {e.preventDefault();setShowUpDownUIPreviews(true);}}}
                            onDragEnter={(e) => { if (e.dataTransfer.types.includes("assignments")) {e.preventDefault();setShowUpDownUIPreviews(true);}}}
                            onDragLeave={() => {setShowUpDownUIPreviews(false);}}
                            onDrop={(e) => {if (e.dataTransfer.types.includes("assignments")) {setUpDownUIOrder(!upDownUIOrder);setShowUpDownUIPreviews(false);}}}
                            >
                                {/* Going to hijack this and use it as a drop area, thanks */}
                                <div className="mt-8 flex items-center justify-between lg:mt-0">
                                    <h2 className="title">Classes</h2>
                                    {loading && <Loading className="ml-8" />}
                                    <h2 
                                    className="text-xl"
                                    //event handlers for the Classes dragging icon
                                    draggable={true} //replace what it inside brackets with a useState for toggling UI changes if needed
                                    onDragStart={(e) => {e.dataTransfer.setDragImage(ReactDOM.findDOMNode(e.currentTarget)?.parentNode?.parentNode as Element,(ReactDOM.findDOMNode(e.currentTarget)?.parentNode?.parentNode as Element).clientWidth,0); e.dataTransfer.setData("classes", "");}}
                                    >░░░░</h2>
                                    {/* above is some very temporary styling, don't get mad at me for the h2 tag */}
                                </div>
                                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 ">
                                    {classes && classes.data? classes.data.map((v, i) => (<Class class={{ data: v }} key={i} className="!w-full xl:!w-[18.5rem]" isLink={true}/>)): [...Array(6)].map((_, i) => <LoadingClass key={i} />)}
                                </div>
                            </section>
                            {/* Assignments UI */}
                            <section className="mb-4"
                            //event handlers for drop area Assignments drop area (where Classes would land)
                            onDragOver={(e) => { if (e.dataTransfer.types.includes("classes")) {e.preventDefault();setShowUpDownUIPreviews(true);}}}
                            onDragEnter={(e) => { if (e.dataTransfer.types.includes("classes")) {e.preventDefault();setShowUpDownUIPreviews(true);}}}
                            onDragLeave={() => {setShowUpDownUIPreviews(false);}}
                            onDrop={(e) => { if (e.dataTransfer.types.includes("classes")) {setUpDownUIOrder(!upDownUIOrder);setShowUpDownUIPreviews(false);}}}            
                            >
                                <div className="flex justify-between">
                                    <h2 className="title">Assignments</h2>
                                    <h2 
                                    className="text-xl"
                                    //event handlers for the Assignments dragging icon
                                    draggable={true} //replace what it inside brackets with a useState for toggling UI changes if needed
                                    onDragStart={(e) => {e.dataTransfer.setDragImage(ReactDOM.findDOMNode(e.currentTarget)?.parentNode?.parentNode as Element,(ReactDOM.findDOMNode(e.currentTarget)?.parentNode?.parentNode as Element).clientWidth,0); e.dataTransfer.setData("assignments", "");}}
                                    >░░░░</h2>
                                    {/* above is some very temporary styling, don't get mad at me for the h2 tag */}
                                </div>
                                <div className="px-4 py-2 flex bg-gray-200 mt-4 rounded-lg">
                                    <p>ASSIGNEMENT VIEW GOES HERE <br></br>text<br></br>text<br></br>IMAGINE THE THING FROM THE FIGMA WAS HEREtext<br></br>text<br></br></p>
                                </div>
                            </section>
                            <div className={showUpDownUIPreviews? "flex w-full bg-gray-100 rounded-md px-2 mb-4": "hidden"}>
                            <br></br>
                            </div>
                        </section>
                        {/* Maybe you can find a better way to do this, but here is a divider */}
                        <section className="w-10"></section>
                        {/* Schedule UI */}
                        <section className="grow">
                            <h2 className="title">Daily Schedule</h2>
                            {/* Line below requires flex. flex was removed temporarily by bill because it made the ui look bad */}
                            {classes && schedule &&
                            <ScheduleComponent classes={classes} schedule={schedule} />
                            }
                        </section>
                    </div>
				</div>
			</div>
		</>
	);
}
