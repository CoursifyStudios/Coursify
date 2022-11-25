import { useState } from "react";
import { useTabs } from "../lib/tabs/handleTabs";
import { createNewSchedule, ScheduleInterface } from "../lib/db/schedule";
import { ColoredPill } from "../components/misc/pill";
import { ErrorMessage, Field, Form, Formik } from "formik";

const Settings = () => {
	const tabs = useTabs((state) => state.tabs);
	const [tempSchedule, setTempSchedule] = useState<ScheduleInterface[]>();
	let tempArray: ScheduleInterface[];
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
						}}
						onSubmit={async (v) => {
							if (tempSchedule != undefined) {
								tempArray = [...tempSchedule];
								tempArray.push({
									timeStart: v.itemStartTime,
									timeEnd: v.itemEndTime,
									block: v.itemBlockNumber,
									type: v.itemScheduleType,
								});
								setTempSchedule(tempArray);
							} else {
								setTempSchedule([
									{
										timeStart: v.itemStartTime,
										timeEnd: v.itemEndTime,
										block: v.itemBlockNumber,
										type: v.itemScheduleType,
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
							<label htmlFor="itemBlockNumber">Block #</label>
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
							></Field>{" "}
							{/* Only two schedule types supported for now */}
							<ErrorMessage name="itemScheduleType" />
							<button
								type="submit"
								className="mr-auto mt-4 rounded-lg bg-blue-200 py-2 px-4 text-blue-600"
							>
								Add schedule item
							</button>
						</Form>
					</Formik>
				</section>
				<section className="grid grid-cols-2">
					<section className="my-6 flex-1 px-5">
						<h2 className="mb-4 text-lg font-semibold">Schedule type 1</h2>
						<div className="mt-6 flex flex-col">
							<div className="mt-6 grid grid-cols-1 gap-5 rounded-xl bg-gray-200 p-4">
								{tempSchedule &&
									typeof tempSchedule != "undefined" &&
									tempSchedule.map(
										(scheduleItem, i) =>
											scheduleItem.type == 1 && (
												<div
													key={i}
													className="flex items-center justify-between font-semibold"
												>
													Block {scheduleItem.block}
													<ColoredPill color="blue">
														{scheduleItem.timeStart} - {scheduleItem.timeEnd}
													</ColoredPill>
													{/* put an x here for removing a schedule item */}
												</div>
											)
									)}
							</div>
						</div>
					</section>
					<section className="my-6 flex-1 px-5">
						<h2 className="mb-4 text-lg font-semibold">Schedule type 2</h2>
						<div className="mt-6 flex flex-col">
							<div className="mt-6 grid grid-cols-1 gap-5 rounded-xl bg-gray-200 p-4">
								{tempSchedule &&
									typeof tempSchedule != "undefined" &&
									tempSchedule.map(
										(scheduleItem, i) =>
											scheduleItem.type == 2 && (
												<div
													key={i}
													className="flex items-center justify-between font-semibold"
												>
													Block {scheduleItem.block}
													<ColoredPill color="blue">
														{scheduleItem.timeStart} - {scheduleItem.timeEnd}
													</ColoredPill>
													{/* put an x here for removing a schedule item */}
												</div>
											)
									)}
							</div>
						</div>
					</section>
				</section>
			</div>
			<div className="mx-10">
				<Formik
					initialValues={{ day: new Date() }}
					onSubmit={(v) => {
						if (tempSchedule != undefined) {
							createNewSchedule(v.day, tempSchedule);
						} else alert("Please add one or more schedule items first");
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
};

export default Settings;
