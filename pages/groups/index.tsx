import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllPublicGroups, PublicGroupsResponse } from "../../lib/db/groups";
import supabase from "../../lib/supabase";

export default function GroupDirectory() {
	const [allGroupData, setAllGroupData] = useState<PublicGroupsResponse>();

	useEffect(() => {
		(async () => {
			const data = await getAllPublicGroups(supabase);
			setAllGroupData(data);
			console.log(data);
		})();
	}, [supabase]);

	return (
		<div>
			<div className="mx-auto my-10 w-full max-w-screen-xl">
				<div className="space-y-3">
					<div className="flex w-1/3 items-center rounded-full bg-gray-300 p-1">
						<MagnifyingGlassIcon className="ml-1 h-6 w-6" />
						<p className="ml-1.5 p-1 ">Search for Groups</p>
					</div>
					<div>
						<h1 className="title">Your Groups</h1>
						<div className="mt-4 grid gap-6 md:grid-cols-3 xl:grid-cols-5 ">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										(!Array.isArray(group.users_groups) ||
											group.users_groups.length != 0) && (
											<GroupSmall
												key={group.id}
												photo="/example-img.jpg"
												title={group.name!}
											/>
										)
								)}
						</div>
					</div>
					<div>
						<h1 className="title">Featured Groups</h1>
						<div className="mt-4 grid gap-6 md:grid-cols-3 xl:grid-cols-4 ">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										//@ts-ignore
										group.featured && (
											<GroupLarge
												key={group.id}
												photo="/example-img.jpg"
												name={group.name!}
												membernum={Math.floor(Math.random() * 2000).toString()}
											/>
										)
								)}
						</div>
					</div>
					<div>
						<h1 className="title">Outdoors</h1>
						<div className="mt-4 grid gap-6 md:grid-cols-3 xl:grid-cols-4 ">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										//@ts-ignore
										group.tags &&
										//@ts-ignore
										group.tags.includes("outdoors") && (
											<GroupLarge
												key={group.id}
												photo="/example-img.jpg"
												name={group.name!}
												membernum={Math.floor(Math.random() * 2000).toString()}
											/>
										)
								)}
						</div>
						<h1 className="title">No Tags</h1>
						<div className="mt-4 grid gap-6 md:grid-cols-3 xl:grid-cols-4 ">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										//@ts-ignore
										!group.tags && (
											<GroupLarge
												key={group.id}
												photo="/example-img.jpg"
												name={group.name!}
												membernum={Math.floor(Math.random() * 2000).toString()}
											/>
										)
								)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const GroupLarge = (props: {
	photo: string;
	name: string;
	membernum: string;
}) => {
	return (
		<div
			className={
				"flex w-[19rem] cursor-pointer flex-col rounded-xl bg-gray-200 transition duration-300 hover:shadow-lg hover:brightness-95 "
			}
		>
			<div className="relative h-32 ">
				<Image
					src="/example-img.jpg"
					alt="Example Image"
					className="rounded-t-xl object-cover object-center"
					fill
				/>
			</div>
			<div className="flex flex-grow flex-col p-4">
				<div className="flex items-start justify-between">
					<h3 className="break-words text-xl font-semibold line-clamp-2">
						{props.name}
					</h3>
				</div>
				<p>{props.membernum} Members</p>
			</div>
		</div>
	);
};

const GroupSmall = (props: { photo: string; title: string }) => {
	return (
		<div
			className="brightness-hover	flex cursor-pointer select-none flex-col rounded-xl bg-gray-200 "
			tabIndex={0}
		>
			<div className="relative h-16">
				<Image
					fill
					className="rounded-t-xl object-cover object-center"
					alt={"Groups image for " + props.title}
					src={props.photo}
				/>
			</div>
			<div className="flex justify-center">
				<h3 className="text-l p-3 font-medium line-clamp-2">{props.title}</h3>
			</div>
		</div>
	);
};
//copyright coursify studios 5783