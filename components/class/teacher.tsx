import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TeacherClassType } from ".";
import { average, median, middle50 } from "../../lib/misc/arrayMath";
import { getDataInArray } from "../../lib/misc/dataOutArray";
import { useSettings } from "../../lib/stores/settings";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";
import Dropdown from "../misc/dropdown";

const TeacherClass: NextPage<TeacherClassType> = ({
	classData,
	className,
	showTimeLoading,
	time,
	isLink,
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
	const getGrade = (grades: number[], type: number) => {
		switch (type) {
			case 0:
				return average(grades);
			case 1:
				return median(grades);
			case 2:
				return middle50(grades);
		}
	};
	const allGrades = useMemo(() => {
		const overall = getGrade(grades, selectedSort.id);
		// TODO: add categories of grades as defined by teacher (thats what the zeros are temporatily)
		return [overall, 0, 0];
	}, [selectedSort]);

	const Header = () => (
		<div className="brightness-hover group relative h-16  overflow-hidden rounded-xl">
			{!settings.compact && (
				<Image
					src={classData?.image ? classData.image : exampleImage}
					loading="eager"
					alt="Example Image"
					className=" absolute inset-0 h-16 w-full object-cover object-center brightness-75 group-hover:brightness-100"
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
				/>
			)}
			<div className="absolute bottom-2 left-4 top-2 flex flex-col justify-center">
				<h3 className="max-w-[15rem] truncate text-xl font-semibold ">
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

	return (
		<div className={`${className} flex w-[19rem] flex-col gap-4`}>
			<Link
				href={"/classes/" + classData.id}
				onClick={() => newTab("/classes/" + classData.id, classData.name)}
			>
				<Header />
			</Link>
			<div
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
			</div>
		</div>
	);
};

export default TeacherClass;
