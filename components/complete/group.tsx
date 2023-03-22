import { NextPage } from "next";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import Image from "next/image";
export const Group: NextPage<{
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
};
