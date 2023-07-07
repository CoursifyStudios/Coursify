import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import { ColoredPill } from "../misc/pill";

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
			<div className="brightness-hover flex cursor-pointer select-none snap-start flex-col rounded-xl bg-backdrop-200 ">
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
	membernum: string;
	isLink?: boolean;
}> = ({ id, photo, name, membernum, isLink }) => {
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
					"flex w-[25rem] cursor-pointer snap-start flex-col rounded-xl bg-backdrop-200 transition duration-300 hover:shadow-lg hover:brightness-95 "
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
						<p className="line-clamp-3 text-sm">{membernum}</p>
					</div>
				</div>
			</div>
		);
	}
};

export const GroupTest: NextPage<{
	id: string;
	photo: string | null | undefined;
	name: string;
	membernum: string;
	isLink?: boolean;
}> = ({ id, photo, name, membernum, isLink }) => {
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
					"flex w-[19rem] cursor-pointer snap-start flex-col rounded-xl bg-backdrop-200 transition duration-300 hover:shadow-lg hover:brightness-95 "
				}
			>
				<div className="relative h-20 ">
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
				<div className="flex items-center justify-between p-3">
					<div>
						<div className="flex items-center justify-between">
							<h3 className="line-clamp-1 overflow-hidden text-ellipsis break-words pr-2 text-xl font-semibold">
								{name}
							</h3>
							<ColoredPill color="green">Joined</ColoredPill>
						</div>
						<p className="line-clamp-2 text-sm">{membernum}</p>
					</div>
				</div>
			</div>
		);
	}
};
