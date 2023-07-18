import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { ColoredPill } from "../components/misc/pill";
import { Database } from "../lib/db/database.types";
import {
	ScheduleInterface,
	ScheduleTemplatesDB,
	TemplateInterface,
	createNewSchedule,
	createNewTemplate,
	getScheduleTemplates,
	to12hourTime,
} from "../lib/db/schedule";
import { useTabs } from "../lib/tabs/handleTabs";
import { useSettings } from "@/lib/stores/settings";

const ScheduleEditor = () => {
	const supabaseClient = useSupabaseClient<Database>();
	const tabs = useTabs((state) => state.tabs);
	const [tempSchedule, setTempSchedule] = useState<ScheduleInterface[]>();
	let tempArray: ScheduleInterface[];
	const [scheduleTemplates, setScheduleTemplates] =
		useState<ScheduleTemplatesDB>();
	const [templateName, setTemplateName] = useState<string>();
	const [template, setTemplate] = useState<number | null>(null);

	const { data: settings } = useSettings();
	useEffect(() => {
		(async () => {
			const scheduleTemplates = await getScheduleTemplates(supabaseClient);
			setScheduleTemplates(scheduleTemplates);
		})();
	}, [supabaseClient]);
	return (
		<div>
			<div className="grid grid-cols-2">
				<section className="my-6 ml-5 px-5">
					<h2 className="mb-4 text-lg font-semibold">
						New Schedule Item: {template ? templateName : ""}
					</h2>
					<h2>
						{template}
						{", "}
						{templateName}
					</h2>
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
							setTemplate(null);
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
								setTempSchedule(
									tempArray.sort((a, b) => {
										if (a.timeStart > b.timeStart) return 1;
										if (a.timeStart < b.timeStart) return -1;
										if (a.timeEnd > b.timeEnd) return 1;
										if (a.timeEnd < b.timeEnd) return -1;
										return 0;
									})
								);
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
								className="mr-auto mt-4 rounded-lg bg-blue-200 px-4 py-2 text-blue-600"
							>
								Add schedule item
							</button>
						</Form>
					</Formik>
				</section>
				<section className="mr-5 grid grid-cols-2">
					<section className="my-6 flex-1 px-5">
						<h2 className="mb-4 text-lg font-semibold">Schedule type 1</h2>
						<div className="mt-6 flex flex-col">
							<div className="mt-6 grid grid-cols-1 gap-5 rounded-xl bg-gray-200 p-4">
								{tempSchedule &&
									tempSchedule.map(
										(scheduleItem, i) =>
											scheduleItem.type == 1 && (
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
															{to12hourTime(
																scheduleItem.timeStart,
																settings.showAMPM
															)}{" "}
															-{" "}
															{to12hourTime(
																scheduleItem.timeEnd,
																settings.showAMPM
															)}{" "}
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
														{/* Look at me doing this without importing a whole package for an svg X */}
													</div>
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
									tempSchedule.map(
										(scheduleItem, i) =>
											scheduleItem.type == 2 && (
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
															{to12hourTime(
																scheduleItem.timeStart,
																settings.showAMPM
															)}{" "}
															-{" "}
															{to12hourTime(
																scheduleItem.timeEnd,
																settings.showAMPM
															)}{" "}
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
														{/* Look at me doing this without importing a whole package for an svg X */}
													</div>
												</div>
											)
									)}
							</div>
						</div>
					</section>
				</section>
			</div>
			<div className="mx-10 grid grid-cols-2 gap-5">
				<Formik
					initialValues={{ day: new Date() }}
					onSubmit={(v) => {
						if (template) {
							createNewSchedule(supabaseClient, v.day, template, null);
						} else if (tempSchedule) {
							createNewSchedule(supabaseClient, v.day, template, tempSchedule);
						} else alert("Please add one or more schedule items first");
					}}
				>
					<Form className="grid grid-cols-1">
						<label htmlFor="day">Day</label>
						<Field name="day" type="date"></Field>
						<ErrorMessage name="day" />

						<button
							type="submit"
							className="mr-auto mt-4 rounded-lg bg-blue-200 px-4 py-2 text-blue-600"
						>
							Add as a Schedule (send to server)
						</button>
					</Form>
				</Formik>
				<div>
					<Formik
						initialValues={{ name: "" }}
						onSubmit={(v) => {
							if (template) {
								alert("Please alter the template");
							} else if (tempSchedule) {
								createNewTemplate(supabaseClient, v.name, tempSchedule);
							} else
								alert(
									"Please add one or more schedule items first and name your "
								);
						}}
					>
						<Form className="grid grid-cols-1">
							<label htmlFor="name">Name Your Template:</label>
							<Field name="name" type="text"></Field>
							<ErrorMessage name="name" />

							<button
								type="submit"
								className="mr-auto mt-4 rounded-lg bg-blue-200 px-4 py-2 text-blue-600"
							>
								Add a New Template
							</button>
						</Form>
					</Formik>
				</div>
			</div>
			<div className="mx-10 mt-5">
				<h2>Schedule Templates:</h2>
				{/* this will be made DRY-er later */}
				{/* I'd like to coin a new term "wringin" for this purpose */}
				<div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
					{scheduleTemplates &&
						scheduleTemplates.data &&
						(scheduleTemplates.data as unknown as TemplateInterface[]).map(
							(v) => (
								<button
									className="rounded-md bg-gray-200 p-4"
									onClick={() => {
										setTempSchedule(
											v.schedule_items as unknown as ScheduleInterface[]
										);
										setTemplateName(v.name);
										setTemplate(v.id);
									}}
									key={v.id}
								>
									<div className="flex justify-center">{v.name}</div>
									<div className="grid grid-cols-2 gap-5">
										<div className="">
											{(v.schedule_items as unknown as ScheduleInterface[]).map(
												(period, iterator) =>
													period.type == 1 && (
														<div className="whitespace-nowrap" key={iterator}>
															{period.timeStart.substring(0, 5)}
															{" - "}
															{period.timeEnd.substring(0, 5)}
														</div>
													)
											)}
										</div>
										<div>
											{(v.schedule_items as unknown as ScheduleInterface[]).map(
												(period, iterator) =>
													period.type == 2 && (
														<div className="whitespace-nowrap" key={iterator}>
															{period.timeStart.substring(0, 5)}
															{" - "}
															{period.timeEnd.substring(0, 5)}
														</div>
													)
											)}
										</div>
									</div>
								</button>
							)
						)}
				</div>
			</div>
		</div>
	);
};
export default ScheduleEditor;
