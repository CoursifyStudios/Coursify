import {
	CalendarDaysIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	DocumentIcon,
	FolderIcon,
	LinkIcon,
	MusicalNoteIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { ColoredPill } from "./pill";

export const InfoPills: NextPage<{
	allPills: InfoPill[];
	updatePills: (data: InfoPill[]) => void;
	isTeacher: boolean;
}> = ({ allPills, updatePills, isTeacher }) => {
	const [pills, setPills] = useState(allPills);
	if (allPills.length == 0) {
		if (isTeacher) {
			return (
				<ColoredPill color="gray" className=" cursor-pointer" hoverState>
					Add InfoPill
				</ColoredPill>
			);
		} else {
			return null;
		}
	}

	const newPill = (pill: InfoPill) => {};

	const deletePill = (pill: InfoPill) => {
		const newPills = pills.find((currentPill) => currentPill == pill);
	};

	return (
		<>
			{pills.map((pill, i) => (
				<div className="group relative" key={i}>
					{pill.link ? (
						<a href={pill.link} target="_blank" className="" rel="noreferrer">
							<ColoredPill
								color={pill.color}
								className="h-7 items-center"
								hoverState
							>
								<PillIcon icon={pill.icon} className="mr-2 h-4 w-4" />
								{pill.name}
							</ColoredPill>
						</a>
					) : (
						<ColoredPill color={pill.color} className="h-7 items-center">
							<PillIcon icon={pill.icon} className="mr-2 h-4 w-4" />
							{pill.name}
						</ColoredPill>
					)}
					{isTeacher && (
						<div className="absolute right-2 top-1.5 bottom-1.5 hidden cursor-pointer place-items-center rounded bg-black/50 text-white group-hover:flex">
							<XMarkIcon className="h-4 w-4" />
						</div>
					)}
				</div>
			))}
			{isTeacher && (
				<ColoredPill
					color="gray"
					className="aspect-square h-7 cursor-pointer items-center justify-center !px-0"
					hoverState
				>
					<PlusIcon className="h-5 w-5" />
				</ColoredPill>
			)}
		</>
	);
};

export interface InfoPill {
	name: string;
	link?: string;
	icon: "doc" | "link" | "chat" | "calender" | "folder" | "music";
	color: "blue" | "green" | "purple" | "red" | "yellow" | "orange" | "gray";
}

const PillIcon: NextPage<{ icon: InfoPill["icon"]; className: string }> = ({
	icon,
	className,
}) => {
	switch (icon) {
		case "doc":
			return <DocumentIcon className={className} />;
		case "link":
			return <LinkIcon className={className} />;
		case "chat":
			return <ChatBubbleOvalLeftEllipsisIcon className={className} />;
		case "calender":
			return <CalendarDaysIcon className={className} />;
		case "folder":
			return <FolderIcon className={className} />;
		case "music":
			return <MusicalNoteIcon className={className} />;
	}
};
