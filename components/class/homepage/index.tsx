import { NextPage } from "next";
import { Class } from "..";
import { AllClassesResponse, isTeacher } from "../../../lib/db/classes";
import { LoadingStudentClass } from "../loading";
import { sortClasses } from "../sorting";
import { Settings, useSettings } from "../../../lib/stores/settings";
import { ScheduleInterface } from "../../../lib/db/schedule";
import { Tab } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";

const HomepageClassesUI: NextPage<{
	loading: boolean;
	classes?: AllClassesResponse;
	schedules?: ScheduleInterface[][];
	userID: string;
}> = ({ classes, loading, schedules, userID }) => {
	const { data: settings } = useSettings();

	const [tab, setTab] = useState(0);

	const view: Settings["homepageView"] | "loading" | "tabbedStudent" =
		useMemo(() => {
			if (settings.homepageView != "auto") {
				switch (settings.homepageView) {
					case "student":
						setTab(1);
						break;
					case "teacher":
					case "tabbed":
						setTab(0);
						break;
				}
				return settings.homepageView;
			}
			if (!classes || !classes.data) {
				return "loading";
			}
			let student = 0;
			let teacher = 0;
			classes.data.forEach((singleClass) => {
				if (isTeacher(singleClass, userID)) {
					teacher += 1;
				} else {
					student += 1;
				}
			});
			if (student == 0) {
				return "teacher";
			}
			if (teacher == 0) {
				return "student";
			}
			if (teacher >= student) {
				return "tabbed";
			}
			if (student > teacher) {
				return "tabbedStudent";
			}
			return "tabbed";
		}, [classes, settings.homepageView, userID]);

	const Classes = ({ teaching }: { teaching: boolean }) => {
		if (classes && classes.data && schedules)
			return (
				<>
					{classes.data
						.slice(0, classes.data.length)
						.sort((a, b) => sortClasses(a, b, schedules[0], schedules[1]))
						.map((singleClass) => {
							const teacher = isTeacher(singleClass, userID);
							if ((teaching && !teacher) || (!teaching && teacher)) return null;

							return (
								<Class
									classData={singleClass}
									showTimeLoading={loading}
									settings={settings}
									teacher={teacher}
									key={singleClass.id}
									className="h-full !w-full xl:!w-[18.5rem]"
									isLink={true}
									time={schedules[0]?.find(
										(s) =>
											s.specialEvent == undefined &&
											singleClass.block == s.block &&
											singleClass.schedule_type == s.type
									)}
								/>
							);
						})}
				</>
			);
		return (
			<>
				{[...Array(6)].map((_, i) => (
					<LoadingStudentClass key={i} className="!w-full xl:!w-[18.5rem]" />
				))}
			</>
		);
	};

	return (
		<Tab.Group selectedIndex={tab} onChange={setTab}>
			<div className="flex items-center justify-between md:mt-8 lg:mt-0">
				<h2 className="title">Classes</h2>
				{(view == "tabbed" || view == "tabbedStudent") && (
					<Tab.List as="div" className="flex items-center">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-lg border px-2 py-1 focus:outline-none ${
										selected
											? "brightness-focus"
											: "border-transparent bg-gray-200"
									} text-sm font-medium`}
								>
									Teacher
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`ml-4 flex cursor-pointer items-center rounded-lg border px-2 py-1 focus:outline-none ${
										selected
											? "brightness-focus"
											: "border-transparent bg-gray-200"
									} text-sm font-medium`}
								>
									Student
								</div>
							)}
						</Tab>
					</Tab.List>
				)}
			</div>
			<Tab.Panels>
				<Tab.Panel
					as="div"
					className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 "
				>
					<Classes teaching={true} />
				</Tab.Panel>
				<Tab.Panel
					as="div"
					className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 "
				>
					<Classes teaching={false} />
				</Tab.Panel>
			</Tab.Panels>
		</Tab.Group>
	);
};

export default HomepageClassesUI;
