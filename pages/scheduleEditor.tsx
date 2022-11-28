import { useEffect, useState } from "react";
import { useTabs } from "../lib/tabs/handleTabs";
import {
	createNewSchedule,
	ScheduleInterface,
	sortedByTime,
	to12hourTime,
} from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../lib/db/database.types";
import { JsxElement } from "typescript";


const ScheduleEditor = () => {
	const supabaseClient = useSupabaseClient<Database>();
	const tabs = useTabs((state) => state.tabs);
	const [tempSchedule, setTempSchedule] = useState<ScheduleInterface[]>();
	let tempArray: ScheduleInterface[];
    const numberOfScheduleTypes: number = 2;
    let arrOfScheduleViewers: JSX.Element[];
	return (
		<div>
			<div className="grid grid-cols-2">
				<section className="my-6 ml-5 px-5">
					<h2 className="mb-4 text-lg font-semibold">New Schedule Item:</h2>
					<Formik
						initialValues={{
							itemStartTime: "09:30",
							itemEndTime: "10:55",
							itemBlockNumber: 1,
							itemScheduleType: 1,
							itemSpecialType: undefined,
							itemCustomColor: undefined,
						}}
						onSubmit={async (v) => {
							if (v.itemSpecialType == "") v.itemSpecialType = undefined;
							if (tempSchedule != undefined) {
								tempArray = [...tempSchedule];
								tempArray.push({
									timeStart: v.itemStartTime,
									timeEnd: v.itemEndTime,
									block: v.itemBlockNumber,
									type: v.itemScheduleType,
									specialEvent: v.itemSpecialType,
									customColor: v.itemCustomColor,
								});
								setTempSchedule(sortedByTime(tempArray));
							} else {
								setTempSchedule([
									{
										timeStart: v.itemStartTime,
										timeEnd: v.itemEndTime,
										block: v.itemBlockNumber,
										type: v.itemScheduleType,
										specialEvent: v.itemSpecialType,
										customColor: v.itemCustomColor,
									},
								]);
							}
						}}
					>
						<Form className="flex flex-col">
							<label htmlFor="itemStartTime">Start time</label>
							<Field name="itemStartTime" type="time" step="min" />
							<ErrorMessage name="itemStartTime" />

							<label htmlFor="itemEndTime">End Time</label>
							<Field name="itemEndTime" type="time" step="min" />
							<ErrorMessage name="itemEndTime" />

							<label htmlFor="itemBlockNumber">
								Block #, if special event decides which block to match schedule
								with
							</label>
							<Field
								name="itemBlockNumber"
								type="number"
								min="1"
								step="1"
							></Field>
							<ErrorMessage name="itemBlockNumber" />

							<label htmlFor="itemScheduleType">Schedule type #</label>
							<Field
								name="itemScheduleType"
								type="number"
								min="1"
								max="2"
								step="1"
							></Field>
							{/* Only two schedule types supported for now */}
							<ErrorMessage name="itemScheduleType" />

							<label htmlFor="itemSpecialType">
								Special event (optional. Use for lunch, etc.)
							</label>
							<Field name="itemSpecialType" type="text"></Field>
							<ErrorMessage name="itemSpecialType" />

							<label htmlFor="itemCustomColor">
								Special event color (optional)
							</label>
							<Field name="itemCustomColor" type="text"></Field>
							<ErrorMessage name="itemCustomColor" />

							<button
								type="submit"
								className="mr-auto mt-4 rounded-lg bg-blue-200 py-2 px-4 text-blue-600"
							>
								Add schedule item
							</button>
						</Form>
					</Formik>
				</section>
				<section className="mr-5 grid grid-cols-2">
                    {[...Array(5)].map((_, i) => scheduleViewer(i + 1))}
				</section>
			</div>
			<div className="mx-10">
				<Formik
					initialValues={{ day: new Date().toISOString().substring(0,10) }}
					onSubmit={(v) => {
						fillOtherScheduleTypesAndHandleSubmit(v);
					}}
                    
				>
					<Form className="grid grid-cols-1">
						<label htmlFor="day">Day</label>
						<Field name="day" type="date"></Field>
						<ErrorMessage name="day" />

						<button
							type="submit"
							className="mr-auto mt-4 rounded-lg bg-blue-200 py-2 px-4 text-blue-600"
						>
							Add to Schedule (send to server)
						</button>
					</Form>
				</Formik>
			</div>
		</div>
	);

    function fillOtherScheduleTypesAndHandleSubmit (stuffToSubmit: { day: string; }) {
        if (tempSchedule != undefined) {
            tempArray = [...tempSchedule];
            //if the schedule is actually filled in with any values...
            for (let scheduleTypeToCheck = 1; scheduleTypeToCheck <= numberOfScheduleTypes; scheduleTypeToCheck++) {
                //check both schedule types...
                if (tempSchedule.every((scheduleItem) => scheduleItem.type == scheduleTypeToCheck)) {
                    //to see if all schedule events are of one type...
                    tempArray = [...tempSchedule]; //and if they are, copy our schedule to this working array...
                    //we have to loop through to add these events to all other schedule types
                    for (let scheduleType = 1; scheduleType <= numberOfScheduleTypes; scheduleType++) {
                        if (scheduleType != scheduleTypeToCheck) {
                            tempSchedule.map(
                                (
                                    scheduleItem,
                                    index 
                                ) => //and copy each shedule item from one type to the other
                                    tempArray.splice(index, 0, {
                                        timeStart: scheduleItem.timeStart,
                                        timeEnd: scheduleItem.timeEnd,
                                        block: scheduleItem.block,
                                        type: scheduleType,
                                        specialEvent: scheduleItem.specialEvent,
                                        customColor: scheduleItem.customColor,
                                    })
                            );
                        }
                    }
                    
                   
                    window.alert("Your schedule will be copied over to the opposite type as you did not supply both types. Click OK to proceed."); 
                    //I plan to make this optional in the future, but that would require a popup with options and stuff, I cannot be bothered right now
                }
            }
            setTempSchedule(sortedByTime(tempArray)); //for updating ui
            createNewSchedule(supabaseClient, stuffToSubmit.day, sortedByTime(tempArray)); //sends schedule to the server
        } else alert("Please add one or more schedule items first");
    }
    function scheduleViewer (scheduleType: number) {
        return <section className="my-6 flex-1 px-5">
        <h2 className="mb-4 text-lg font-semibold">Schedule type {scheduleType}</h2>
        <div className="mt-6 flex flex-col">
            <div className="mt-6 grid grid-cols-1 gap-5 rounded-xl bg-gray-200 p-4">
                {tempSchedule &&
                    tempSchedule &&
                    tempSchedule.map(
                        (scheduleItem, i) =>
                            scheduleItem.type == scheduleType && (
                                <div
                                    key={i}
                                    className="flex items-center justify-between font-semibold"
                                >
                                    {scheduleItem.specialEvent}
                                    {!scheduleItem.specialEvent
                                        ? "Block " + scheduleItem.block
                                        : ""}
                                    <div className="flex items-center justify-between font-semibold">
                                        <ColoredPill
                                            color={
                                                !scheduleItem.specialEvent
                                                    ? "blue"
                                                    : !scheduleItem.customColor
                                                    ? "green"
                                                    : scheduleItem.customColor
                                            }
                                        >
                                            {to12hourTime(scheduleItem.timeStart)} -{" "}
                                            {to12hourTime(scheduleItem.timeEnd)}{" "}
                                        </ColoredPill>
                                        <p
                                            className="ml-3 text-red-600"
                                            onClick={() => {
                                                tempArray = [...tempSchedule];
                                                tempArray.splice(i, 1);
                                                setTempSchedule(tempArray);
                                            }}
                                        >
                                            X
                                        </p>
                                        {/* Look at me doing this wihtout importing a whole package for an svg X */}
                                    </div>
                                </div>
                            )
                    )}
            </div>
        </div>
    </section>
    }
};


export default ScheduleEditor;

