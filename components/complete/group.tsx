import { NextPage } from "next";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import Image from "next/image";
export const GroupSmall: NextPage<{
	photo: string;
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
			<div
				className="brightness-hover	flex cursor-pointer select-none flex-col rounded-xl bg-gray-200 "
				tabIndex={0}
			>
				<div className="relative h-16">
					<Image
						fill
						className="rounded-t-xl object-cover object-center"
						alt={"Groups image for " + title}
						src={photo}
					/>
				</div>
				<div className="flex justify-center">
					<h3 className="text-l p-3 font-medium line-clamp-2">{title}</h3>
				</div>
			</div>
		);
	}
}; //combine these into one at some point
export const GroupLarge: NextPage<{
	id: string;
	photo: string;
	name: string;
	membernum: number;
	isLink?: boolean;
}> = ({ id, photo, name, membernum, isLink }) => {
	const { newTab } = useTabs();
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
					" flex w-[19rem] cursor-pointer snap-start flex-col rounded-xl bg-gray-200 transition duration-300 hover:shadow-lg hover:brightness-95 "
				}
			>
				<div className="relative h-32 ">
					<Image
						src={photo}
						alt="Example Image"
						className="rounded-t-xl object-cover object-center"
						fill
					/>
				</div>
				<div className="flex flex-grow flex-col p-4">
					<div className="flex items-start justify-between">
						<h3 className="break-words text-xl font-semibold line-clamp-2">
							{name}
						</h3>
					</div>
					<p>{membernum} Members</p>
				</div>
			</div>
		);
	}
};
