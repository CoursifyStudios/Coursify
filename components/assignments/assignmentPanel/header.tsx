import { ButtonIcon } from "@/components/misc/button";
import { ColoredPill, CopiedHover } from "@/components/misc/pill";
import { AssignmentResponse } from "@/lib/db/assignments/assignments";
import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	ChevronLeftIcon,
	LinkIcon,
} from "@heroicons/react/24/outline";
import { NextPage } from "next";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { submissionType } from "../assignmentCreation/submissionType";

const AssignmentHeader: NextPage<{
	assignment: AssignmentResponse;
	fullscreen: boolean;
	setFullscreen: Dispatch<SetStateAction<boolean>>;
}> = ({ assignment, fullscreen, setFullscreen }) => {
	if (!assignment.data) return null;

	const type = submissionType.find(
		(type) => type.type == assignment.data.type
	)!;
	return (
		<section className="w-full flex items-start justify-between">
			<div className="w-full mr-4 grow lg:max-w-lg xl:max-w-xl">
				<Link
					className="w-full  md:hidden"
					href="/assignments/0"
					onClick={() => setFullscreen(false)}
				>
					<ButtonIcon
						icon={<ChevronLeftIcon className="w-full h-5 w-5" />}
						className="w-full mb-4"
					/>
				</Link>
				<div className="w-full flex gap-2">
					<Link
						href={
							"/classes/" +
							(Array.isArray(assignment.data.classes)
								? assignment.data.classes[0].id
								: assignment.data.classes?.id)
						}
					>
						<ColoredPill
							color={
								assignment.data.classes
									? Array.isArray(assignment.data.classes)
										? assignment.data.classes[0].color
										: assignment.data.classes?.color
									: "blue"
							}
							hoverState
						>
							{assignment.data.classes
								? Array.isArray(assignment.data.classes)
									? assignment.data.classes[0].name
									: assignment.data.classes.name
								: "Error fetching class"}
						</ColoredPill>
					</Link>
					<ColoredPill color="gray" className="w-full flex gap-2">
						{type.icon}
						{type.name}
					</ColoredPill>
				</div>
				<div className="w-full mt-4 w-full rounded-xl bg-gray-200 p-4">
					<h1 className="w-full title mb-2 line-clamp-2">
						{assignment.data.name}
					</h1>
					<p className="w-full line-clamp-2 text-gray-700">
						{assignment.data.description}
					</p>
				</div>
			</div>
			<div className="w-full flex md:space-x-4">
				<CopiedHover copy={window.location.href}>
					<ButtonIcon icon={<LinkIcon className="w-full h-5 w-5" />} />
				</CopiedHover>
				<div onClick={() => setFullscreen(!fullscreen)}>
					<ButtonIcon
						icon={
							fullscreen ? (
								<ArrowsPointingInIcon className="w-full h-5 w-5" />
							) : (
								<ArrowsPointingOutIcon className="w-full h-5 w-5" />
							)
						}
						className="w-full hidden items-center justify-center md:flex"
					/>
				</div>
			</div>
		</section>
	);
};

export default AssignmentHeader;
