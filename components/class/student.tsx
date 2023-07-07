import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { StudentClassType } from ".";
import { to12hourTime } from "../../lib/db/schedule";
import { useSettings } from "../../lib/stores/settings";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";
import { ColoredPill } from "../misc/pill";

const StudentClass: NextPage<StudentClassType> = ({
	classData,
	className,
	showTimeLoading,
	time,
}) => {
	const { newTab } = useTabs();
	const { data: settings } = useSettings();

	return (
		<div
			className={
				"brightness-hover group flex h-full w-[19rem] cursor-pointer select-none flex-col rounded-xl bg-backdrop-200 compact:p-2" +
				className
			}
		>
			<div className="relative h-32 compact:static compact:h-max">
				{!settings.compact && (
					<Image
						src={classData?.image ? classData.image : exampleImage}
						loading="eager"
						alt="Example Image"
						className="absolute inset-0 h-32 rounded-t-xl object-cover object-center"
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
					/>
				)}
				<div className="absolute left-2 right-2 top-2 flex items-center justify-between space-x-2 compact:static compact:px-2 compact:pt-2">
					{classData.room && (
						<ColoredPill
							//color="gray"
							className="-mb-0.5 -mt-1 !bg-neutral-500/50 text-xs text-gray-100 backdrop-blur-xl compact:!bg-neutral-500/20 compact:text-sm compact:text-gray-800"
						>
							Rm. {classData.room}
						</ColoredPill>
					)}
					<div className="flex items-center">
						<h2
							className={`text-xl compact:text-sm text-${classData.color}-300 ml-2 rounded-lg bg-neutral-500/20 px-2 font-bold opacity-75 backdrop-blur-xl compact:flex compact:text-gray-800`}
						>
							<span className="mr-1.5 hidden compact:block">Block </span>
							{classData.block}
						</h2>
					</div>
				</div>
			</div>
			<div className="flex grow flex-col p-4 compact:p-2">
				<div className="flex items-start justify-between">
					<h3 className="line-clamp-2 break-words text-xl font-semibold">
						{classData.name}
					</h3>
					<ColoredPill
						color={time?.timeStart != undefined ? classData.color : "gray"}
						className={
							showTimeLoading
								? "h-5 w-20 animate-pulse"
								: time?.timeStart == undefined
								? "hidden"
								: ""
						}
					>
						{time?.timeStart != undefined && !showTimeLoading
							? to12hourTime(time?.timeStart) +
							  " - " +
							  to12hourTime(time?.timeEnd)
							: ""}
					</ColoredPill>
				</div>
				<div className="mt-2 flex flex-wrap items-center gap-0.5 compact:flex-nowrap compact:overflow-hidden">
					{"class_users" in classData &&
						"users" in classData &&
						(Array.isArray(classData.class_users!) ? (
							classData.class_users!.filter((userData) => userData.teacher)
								.length > 0 ? (
								classData
									.class_users!.filter((userData) => userData.teacher)
									.splice(0, settings.compact ? 2 : 6)
									.map((userData, i) => {
										const user = !Array.isArray(classData.users!)
											? classData.users!
											: classData.users!.find(
													(user) => user.id == userData.user_id
											  );
										if (!user)
											return (
												<p className="text-sm italic text-gray-700" key={i}>
													No teacher
												</p>
											);

										return (
											<div key={user.id}>
												<Link
													href={`/profile/${user.id}`}
													className=" flex flex-col items-center"
													onClick={(e) => {
														e.stopPropagation();
														newTab(
															"/profile/" + user.id,
															user.full_name.split(" ")[0] + "'s Profile"
														);
													}}
												>
													<div className="peer flex items-center rounded-full py-0.5 pl-1 pr-2 hover:bg-gray-300">
														<Image
															src={user.avatar_url}
															alt="Profile picture"
															referrerPolicy="no-referrer"
															className=" mr-1 rounded-full shadow shadow-black/25 "
															height={20}
															width={20}
														/>
														<div className="font-semibold compact:truncate ">
															{user.full_name}
														</div>
													</div>
												</Link>
												<p className="-ml-0.5 mr-2 [&:last-child]:hidden">,</p>
											</div>
										);
									})
							) : (
								<p className="text-sm italic text-gray-700">No teacher</p>
							)
						) : Array.isArray(classData.users) ? (
							<p>An unknown error occured</p>
                            //@ts-expect-error
						) : classData.class_users?.teacher ? (
                            //@ts-expect-error
							<p>{classData.users?.full_name}</p>
						) : (
							<p className="text-sm italic text-gray-700">No teacher</p>
						))}
				</div>
			</div>
		</div>
	);
};

export default StudentClass;
