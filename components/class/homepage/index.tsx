import { Tab } from "@headlessui/react";
import { NextPage } from "next";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Class } from "..";
import { AllClasses } from "../../../lib/db/classes";
import { ScheduleInterface } from "../../../lib/db/schedule";
import { Settings, useSettings } from "../../../lib/stores/settings";
import { LoadingStudentClass } from "../loading";
import { isTeacher } from "@/lib/misc/users";
//import { sortClasses } from "../sorting";

const HomepageClassesUI: NextPage<{
	loading: boolean;
	classes?: AllClasses;
	userID: string;
}> = ({ classes, loading, userID }) => {
	const { data: settings } = useSettings();

	const view: Settings["homepageView"] | "loading" | "tabbedStudent" =
		useMemo(() => {
			if (settings.homepageView != "auto") {
				switch (settings.homepageView) {
					case "student":
						break;
					case "teacher":
					case "tabbed":
						break;
				}
				return settings.homepageView;
			}
			if (!classes || !Array.isArray(classes)) {
				return "loading";
			}
			let student = 0;
			let teacher = 0;
			classes.forEach((mappedClass) => {
				if (isTeacher(mappedClass, userID)) {
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

	const [tab, setTab] = useState(
		view == "student" || view == "tabbedStudent" ? 1 : 0
	);

	useEffect(() => {
		if ((view == "student" || view == "tabbedStudent") && tab !== 1) {
			setTab(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [view]);

	const Classes = ({ teaching }: { teaching: boolean }) => {
		if (classes && Array.isArray(classes))
			return (
				<>
					{classes
						.slice(0, classes.length)
						.sort((a, b) => a.class!.block - b.class!.block)
						.map((mappedClass) => {
							const teacher = isTeacher(mappedClass, userID);
							if (
								(teaching && !teacher) ||
								(!teaching && teacher) ||
								!mappedClass.class
							)
								return null;

							return (
								<Class
									classData={mappedClass.class}
									showTimeLoading={loading}
									teacher={teacher}
									key={mappedClass.class.id}
									className="h-full !w-full lg:!w-[18.5rem]"
									isLink={true}
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
					{view == "student" ? (
						// Temporary fix for student classes not showing if a student isn't a teacher of any classes
						<Classes teaching={false} />
					) : (
						<Classes teaching={true} />
					)}
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
