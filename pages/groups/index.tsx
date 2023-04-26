import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GroupLarge, GroupSmall } from "../../components/complete/group";
import { getAllPublicGroups, PublicGroupsResponse } from "../../lib/db/groups";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../lib/db/database.types";

export default function GroupDirectory() {
	const [allGroupData, setAllGroupData] = useState<PublicGroupsResponse>();

	const supabase = useSupabaseClient<Database>();
	useEffect(() => {
		(async () => {
			const data = await getAllPublicGroups(supabase);
			setAllGroupData(data);
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
						<h1 id="Your_groups" className="title">
							Your Groups
						</h1>
						<div className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										(!Array.isArray(group.class_users) ||
											group.class_users.length != 0) && (
											<GroupSmall
												key={group.id}
												id={group.id}
												photo={group.image}
												title={group.name!}
												isLink={true}
											/>
										)
								)}
						</div>
					</div>
					<div>
						<h1 id="Featured_groups" className="title">
							Featured Groups
						</h1>
						<div className="scrollbar-fancy mt-4 flex snap-x snap-proximity space-x-5 overflow-x-auto">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										group.tags &&
										group.tags.includes("featured") && (
											<GroupLarge
												key={group.id}
												id={group.id}
												photo={group.image}
												isMember={
													!Array.isArray(group.class_users) ||
													group.class_users.length != 0
												}
												name={group.name!}
												membernum={Math.floor(Math.random() * 2000)}
												isLink={true}
											/>
										)
								)}
						</div>
					</div>
					<div>
						<h1 id="Outdoors" className="title">
							Outdoors
						</h1>
						<div className="scrollbar-fancy snap-priority mt-4 flex snap-x space-x-5 overflow-x-auto">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										group.tags &&
										group.tags.includes("outdoors") && (
											<GroupLarge
												key={group.id}
												id={group.id}
												photo={group.image}
												isMember={
													!Array.isArray(group.class_users) ||
													group.class_users.length != 0
												}
												name={group.name!}
												membernum={Math.floor(Math.random() * 2000)}
												isLink={true}
											/>
										)
								)}
						</div>
						<h1 id="No_tags" className="title mt-4">
							No Tags
						</h1>
						<div className="mt-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{allGroupData &&
								allGroupData.data &&
								allGroupData.data.map(
									(group) =>
										!group.tags && (
											<GroupLarge
												key={group.id}
												id={group.id}
												photo={group.image}
												isMember={
													!Array.isArray(group.class_users) ||
													group.class_users.length != 0
												}
												name={group.name!}
												membernum={Math.floor(Math.random() * 2000)}
												isLink={true}
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

//copyright coursify studios 5783
