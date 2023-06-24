import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TeacherClassType } from ".";
import { to12hourTime } from "../../lib/db/schedule";
import { getDataInArray } from "../../lib/misc/dataOutArray";
import { average, median, middle50, round } from "../../lib/misc/math";
import { useSettings } from "../../lib/stores/settings";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";
import { submissionType } from "../complete/assignments/assignmentCreation/submissionType";
import LineCounter from "../counters/line";
import Dropdown from "../misc/dropdown";
import { ColoredPill } from "../misc/pill";

const TeacherClass: NextPage<TeacherClassType> = ({
	classData,
	className,
	showTimeLoading,
	time,
}) => {
	const { data: settings } = useSettings();
	const { newTab } = useTabs();

	const sortTypes: { id: number; name: string }[] = [
		{
			id: 0,
			name: "Average",
		},
		{
			id: 1,
			name: "Median",
		},
		{
			id: 2,
			name: "Avg. Middle 50%",
		},
	];
	const [selectedSort, setSelectedSort] = useState(sortTypes[0]);

	const grades: number[] = getDataInArray(classData.class_users!).map(
		(user) => user.grade || 0
	);
	const getGrade = (grades: number[], type: number): number => {
		switch (type) {
			case 0:
				return average(grades);
			case 1:
				return median(grades);
			case 2:
				return middle50(grades);
			default:
				return 0;
		}
	};
	const allGrades = useMemo(() => {
		const overall = round(getGrade(grades, selectedSort.id));
		// TODO: add categories of grades as defined by teacher (thats what the zeros are temporarily)
		return [overall, 75, 50];
	}, [grades, selectedSort.id]);

	const Header = () => (
		<div className="brightness-hover group relative h-16  overflow-hidden rounded-xl">
			{!settings.compact && (
				<Image
					src={classData?.image ? classData.image : exampleImage}
					loading="eager"
					alt="Example Image"
					className=" absolute inset-0 h-16 w-full object-cover object-center brightness-75 transition duration-300 group-hover:brightness-90"
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
				/>
			)}
			<div className="absolute bottom-2 left-4 top-2 flex flex-col justify-center">
				<h3 className="max-w-[15rem] truncate text-xl font-semibold text-gray-200 dark:text-gray-800">
					{classData.name}
				</h3>
			</div>
			<div className="absolute bottom-2 right-4 top-2 flex items-center ">
				<h2
					className={`text-xl compact:text-sm text-${classData.color}-300 ml-2 rounded-lg !bg-neutral-500/50 px-2 font-bold opacity-75 backdrop-blur-xl compact:flex compact:bg-neutral-500/20 compact:text-gray-800`}
				>
					<span className="mr-1.5 hidden compact:block">Block </span>
					{classData.block}
				</h2>
			</div>
		</div>
	);

	const GradesSection: NextPage<{ name: string; grade: number }> = ({
		grade,
		name,
	}) => (
		<div>
			<h4>{name}</h4>
			<div className="flex items-center text-base leading-4">
				<LineCounter amount={grade} />
				<p className="ml-2">{grade}%</p>
			</div>
		</div>
	);

	return (
		<div className={`${className} flex w-[19rem] flex-col gap-3.5`}>
			<Link
				href={"/classes/" + classData.id}
				onClick={() => newTab("/classes/" + classData.id, classData.name)}
			>
				<Header />
			</Link>
			{/* Grades */}
			<section
				className={`group flex cursor-pointer flex-col rounded-xl bg-backdrop-200 px-3 py-2 hover:z-20 compact:p-2`}
			>
				<div className="flex justify-between">
					<div>
						<h3 className="text-lg font-bold">Statistics</h3>
						<p className="text-xs">S2 - Q4</p>
					</div>
					<Dropdown
						selectedValue={selectedSort}
						onChange={(value) => setSelectedSort(value)}
						values={sortTypes}
						className="my-2 text-sm"
						optionsClassName="w-36 "
					/>
				</div>
				<div className="mt-3 flex flex-col gap-2 text-sm font-medium leading-3">
					<GradesSection name="Overall" grade={allGrades[0]} />
					<GradesSection name="Summative (80%)" grade={allGrades[1]} />
					<GradesSection name="Formative (20%)" grade={allGrades[2]} />
				</div>
			</section>
			{classData.assignments &&
				getDataInArray(classData.assignments).map((assignment, i) => {
					const dueDate = assignment.due_date
						? new Date(assignment.due_date)
						: null;
					return (
						<section
							className={`group flex cursor-pointer items-center rounded-xl bg-backdrop-200 px-3 py-2 hover:z-20 compact:p-2`}
							key={i}
						>
							<div className="mr-3 grid h-9 w-9 min-w-[2.25rem] place-items-center rounded-full bg-gray-300 dark:bg-gray-200">
								{
									submissionType.find((type) => type.type == assignment.type)
										?.icon
								}
							</div>
							<div className="flex flex-col ">
								<h4 className="max-w-[10.5rem] truncate text-sm font-medium">
									{assignment.name}
								</h4>
								<p className="text-xs">12/24 students submitted</p>
							</div>
							<div
								tabIndex={-1}
								className="ml-auto flex flex-col items-center text-xs"
							>
								{dueDate && (
									<>
										<div className="mb-0.5 font-medium text-gray-700">
											{dueDate.getMonth() + 1}/{dueDate.getDate()}
										</div>
										<ColoredPill color={classData.color} className="text-xs">
											{`${to12hourTime(dueDate)}`}
										</ColoredPill>
									</>
								)}
							</div>
						</section>
					);
				})}
		</div>
	);
};

export default TeacherClass;
