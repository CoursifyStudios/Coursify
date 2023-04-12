import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { GroupLarge, GroupSmall } from "../../components/complete/group";
import { getAllPublicGroups, PublicGroupsResponse } from "../../lib/db/groups";
import supabase from "../../lib/supabase";

export default function GroupDirectory() {
	const [allGroupData, setAllGroupData] = useState<PublicGroupsResponse>();

	useEffect(() => {
		(async () => {
			const data = await getAllPublicGroups(supabase);
			setAllGroupData(undefined);
		})();
	}, [supabase]);

	return (
		<div>
			<div className="mx-auto my-10 w-full max-w-screen-xl px-4">
				<div className="space-y-3">
					{/* <div className="flex w-1/3 items-center rounded-full bg-gray-300 p-1">
						<MagnifyingGlassIcon className="ml-1 h-6 w-6" />
						<p className="ml-1.5 p-1 ">Search for Groups</p>
					</div> */}
					<div>
						<h1 className="title">Your Groups</h1>
						<div className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
							{allGroupData?.data
								? allGroupData.data.map(
										(group) =>
											(!Array.isArray(group.users_groups) ||
												group.users_groups.length != 0) && (
												<GroupSmall
													key={group.id}
													id={group.id}
													photo={group.image}
													title={group.name!}
													isLink={true}
												/>
											)
								  )
								: [...Array(4)].map((_, i) => (
										<div
											key={i}
											className="h-28 animate-pulse rounded-xl bg-gray-200"
										></div>
								  ))}
						</div>
					</div>
					<div>
						<h1 className="title">Featured Groups</h1>
						<div className="scrollbar-fancy mt-4 flex snap-x snap-proximity space-x-5 overflow-x-auto">
							{allGroupData?.data
								? allGroupData.data.map(
										(group) =>
											group.featured && (
												<GroupLarge
													key={group.id}
													id={group.id}
													photo={group.image}
													name={group.name!}
													membernum={Math.floor(Math.random() * 2000)}
													isLink={true}
												/>
											)
								  )
								: [...Array(3)].map((_, i) => (
										<div
											key={i}
											className="h-40 w-64 animate-pulse rounded-xl bg-gray-200"
										></div>
								  ))}
						</div>
					</div>
					<div>
						<h1 className="title">Outdoors</h1>
						<div className="scrollbar-fancy snap-priority mt-4 flex snap-x space-x-5 overflow-x-auto">
							{allGroupData?.data
								? allGroupData.data.map(
										(group) =>
											group.tags &&
											group.tags.includes("outdoors") && (
												<GroupLarge
													key={group.id}
													id={group.id}
													photo={group.image}
													name={group.name!}
													membernum={Math.floor(Math.random() * 2000)}
													isLink={true}
												/>
											)
								  )
								: [...Array(3)].map((_, i) => (
										<div
											key={i}
											className="h-40 w-64 animate-pulse rounded-xl bg-gray-200"
										></div>
								  ))}
						</div>
						<h1 className="title mt-4">No Tags</h1>
						<div className="mt-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{allGroupData?.data
								? allGroupData.data.map(
										(group) =>
											!group.tags && (
												<GroupLarge
													key={group.id}
													id={group.id}
													photo={group.image}
													name={group.name!}
													membernum={Math.floor(Math.random() * 2000)}
													isLink={true}
												/>
											)
								  )
								: [...Array(6)].map((_, i) => (
										<div
											key={i}
											className="h-40 w-64 animate-pulse rounded-xl bg-gray-200"
										></div>
								  ))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

//copyright coursify studios 5783
