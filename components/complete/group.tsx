import { NextPage } from "next";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import Image from "next/image";
import { addUserToGroup } from "../../lib/db/groups";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "../misc/button";

export const GroupSmall: NextPage<{
	photo: string | null | undefined;
	title: string;
	id: string;
	isLink?: boolean;
}> = ({ photo, title, id, isLink }) => {
	const { newTab } = useTabs();
	if (isLink) {
		return (
			<Link
				href={isLink && "/groups/" + id}
				onClick={() => newTab("/groups/" + id, title)}
			>
				<Groups />
			</Link>
		);
	}
	return <Groups />;
	function Groups() {
		return (
			<div className="brightness-hover	flex cursor-pointer select-none snap-start flex-col rounded-xl bg-gray-200 ">
				<div className="relative h-16">
					{photo ? (
						<Image
							src={photo}
							alt={"Image for " + title}
							className="rounded-t-xl object-cover object-center"
							fill
						/>
					) : (
						<div className="absolute inset-0 animate-pulse bg-gray-200" />
					)}
				</div>
				<div className="flex justify-center">
					<h3 className="text-l line-clamp-2 p-3 font-medium">{title}</h3>
				</div>
			</div>
		);
	}
}; //combine these into one at some point
export const GroupLarge: NextPage<{
	id: string;
	photo: string | null | undefined;
	name: string;
	isMember: boolean;
	membernum: number;
	isLink?: boolean;
}> = ({ id, photo, name, isMember, membernum, isLink }) => {
	const { newTab } = useTabs();
	const user = useUser();
	const supabase = useSupabaseClient();
	if (isLink) {
		return (
			<Link
				href={isLink && "/groups/" + id}
				onClick={() => newTab("/groups/" + id, name)}
			>
				<Groups />
			</Link>
		);
	}
	return <Groups />;
	function Groups() {
		return (
			<div
				className={
					"flex w-[19rem] cursor-pointer snap-start flex-col rounded-xl bg-gray-200 transition duration-300 hover:shadow-lg hover:brightness-95 "
				}
			>
				<div className="relative h-32 ">
					{photo ? (
						<Image
							src={photo}
							alt={"Image for " + name}
							className="rounded-t-xl object-cover object-center"
							fill
						/>
					) : (
						<div className="absolute inset-0 animate-pulse bg-gray-200" />
					)}
				</div>
				<div className="flex items-center justify-between p-4">
					<div>
						<div className="flex items-start justify-between">
							<h3 className="line-clamp-2 break-words text-xl font-semibold">
								{name}
							</h3>
						</div>
						<p>{membernum} Members</p>
					</div>
					{user && (
						<Button
							className="isolate-auto brightness:hover rounded-lg px-2 py-1 font-medium text-white"
							color="bg-blue-500"
							onClick={async () => {
								addUserToGroup(supabase, id, user.id);
							}}
							disabled={isMember}
						>
							Join{isMember && "ed"}
						</Button>
					)}
				</div>
			</div>
		);
	}
};
